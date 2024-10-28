import {Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {OAuth2Client} from 'google-auth-library';
import {HttpService} from '@nestjs/axios';
import * as msal from '@azure/msal-node';
import * as jwksClient from 'jwks-rsa';
import * as jwt from 'jsonwebtoken';
import * as querystring from 'querystring';
import * as cryptoO from 'crypto';
import {EmailService} from 'src/common/email/email.service';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {User} from 'src/entity/User.entity';
import {SocialNetwork} from 'src/entity/SocialNetwork.entity';
interface GooglePayload {
	sub: string;
	email: string;
	email_verified: boolean;
	name: string;
	picture: string;
	given_name: string;
	family_name: string;
	iat: number;
	exp: number;
	jti: string;
}
@Injectable()
export class AuthService {
	private googleClient: OAuth2Client;
	private msalClient: msal.PublicClientApplication;

	constructor(
		@InjectRepository(User) private userRepository: Repository<User>,
		@InjectRepository(SocialNetwork) private socialNetworkRepository: Repository<SocialNetwork>,
		private jwtService: JwtService,
		private httpService: HttpService,
		private readonly emailService: EmailService,
	) {
		this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
		this.msalClient = new msal.PublicClientApplication({
			auth: {
				clientId: process.env.OUTLOOK_CLIENT_ID,
				clientSecret: process.env.OUTLOOK_CLIENT_SECRET, // Make sure to include this
				authority: `https://login.microsoftonline.com/${process.env.OUTLOOK_TENANT_ID}`,
			},
		});
	}

	async validateUser(email: string, password: string): Promise<any> {
		const user = await this.userRepository.findOne({where: {email}});

		if (user && (await bcrypt.compare(password, user.password))) {
			// Excluir la propiedad 'password' antes de devolver el usuario
			const {password, ...result} = user;
			return result; // Devolver solo la información del usuario sin la contraseña
		}

		return null; // Devuelve null si las credenciales son inválidas
	}

	async login(user: any) {
		console.log(user);
		const payload = {email: user.email, sub: user._id};
		return {
			access_token: this.jwtService.sign(payload),
		};
	}

	async googleLogin(token: string) {
		try {
			const ticket = await this.googleClient.verifyIdToken({
				idToken: token,
				audience: process.env.GOOGLE_CLIENT_ID,
			});
			const payload = ticket.getPayload();
			return this.handleSocialLogin('google', payload.sub, payload);
		} catch (error) {
			console.error('Error during Google login:', error);
			throw new Error('Google login failed. Please try again later.');
		}
	}

	private client = jwksClient({
		jwksUri: 'https://www.googleapis.com/oauth2/v3/certs', // Endpoint donde Google publica sus claves públicas
	});

	// Función para obtener la clave pública
	private getKey(header, callback) {
		this.client.getSigningKey(header.kid, (err, key) => {
			const signingKey = key.getPublicKey();
			callback(null, signingKey);
		});
	}

	async googleOneTapLogin(credential: string) {
		//console.log('Se recibe el credential:', credential);

		try {
			// Verificación del token usando la clave pública de Google
			const payload = await new Promise<GooglePayload>((resolve, reject) => {
				jwt.verify(credential, this.getKey.bind(this), {algorithms: ['RS256']}, (err, decoded) => {
					if (err) {
						return reject(err);
					}
					resolve(decoded as GooglePayload);
				});
			});

			if (!payload) {
				throw new Error('No se pudo verificar el token');
			}

			return this.handleSocialLogin('google', payload.sub, payload);
		} catch (error) {
			console.error('Error during Google One Tap login:', error);
			throw new Error('Google One Tap login failed. Please try again later.');
		}
	}

	async googlePlusLogin(accessToken: string) {
		try {
			const {data} = await this.httpService.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`).toPromise();
			return this.handleSocialLogin('google_plus', data.id, data);
		} catch (error) {
			console.error('Error during Google Plus login:', error);
			throw new Error('Google Plus login failed. Please try again later.');
		}
	}

	async facebookLogin(accessToken: string) {
		try {
			const {data} = await this.httpService.get(`https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`).toPromise();
			return this.handleSocialLogin('facebook', data.id, data);
		} catch (error) {
			console.error('Error during Facebook login:', error);
			throw new Error('Facebook login failed. Please try again later.');
		}
	}

	private generateCodeVerifier(): string {
		return cryptoO.randomBytes(32).toString('base64url');
	}

	private async generateCodeChallenge(verifier: string): Promise<string> {
		const hash = cryptoO.createHash('sha256').update(verifier).digest();
		return Buffer.from(hash).toString('base64url');
	}

	async getOutlookAuthorizationUrl(): Promise<{url: string; codeVerifier: string; state: string}> {
		const codeVerifier = this.generateCodeVerifier();
		const codeChallenge = await this.generateCodeChallenge(codeVerifier);
		const state = cryptoO.randomBytes(16).toString('hex');

		const baseUrl = `https://login.microsoftonline.com/${process.env.OUTLOOK_TENANT_ID}/oauth2/v2.0/authorize`;

		const params = {
			client_id: process.env.OUTLOOK_CLIENT_ID,
			response_type: 'code',
			redirect_uri: process.env.OUTLOOK_REDIRECT_URI,
			scope: 'user.read offline_access',
			response_mode: 'query',
			//prompt: 'consent',
			state: state,
			code_challenge: codeChallenge,
			code_challenge_method: 'S256',
		};

		const queryString = querystring.stringify(params);
		const authUrl = `${baseUrl}?${queryString}`;
		//console.log('MANDADO: ', codeVerifier);
		return {url: authUrl, codeVerifier, state};
	}

	async outlookLogin(code: string, codeVerifier: string, state: string) {
		const coderesquest: msal.AuthorizationCodeRequest = {
			code: code,
			scopes: ['user.read', 'offline_access'],
			redirectUri: process.env.OUTLOOK_REDIRECT_URI,
			codeVerifier: codeVerifier,
			state: state,
		};
		try {
			const response = await this.msalClient.acquireTokenByCode(coderesquest);
			//console.log('Respuesta: ', response);
			const {data} = await this.httpService
				.get('https://graph.microsoft.com/v1.0/me', {
					headers: {Authorization: `Bearer ${response.accessToken}`},
				})
				.toPromise();

			return this.handleSocialLogin('outlook', data.id, data);
		} catch (error) {
			console.error('Error during Outlook login:', error);
			if (error instanceof msal.AuthError) {
				console.error('MSAL Error:', error.errorCode, error.errorMessage);
			} else {
				console.error('Unexpected Error:', error);
			}
			throw new Error('Outlook login failed. Please try again later.');
		}
	}

	async appleLogin(idToken: string) {
		try {
			const decodedToken = this.jwtService.verify(idToken, {
				secret: process.env.APPLE_CLIENT_SECRET,
			});
			return this.handleSocialLogin('apple', decodedToken.sub, decodedToken);
		} catch (error) {
			console.error('Error during Apple login:', error);
			throw new Error('Apple login failed. Please try again later.');
		}
	}

	private async handleSocialLogin(provider: string, providerId: string, userData: any) {
		const email = userData.email || userData.mail;
		if (!email) {
			return {message: 'No se pudo verificar el token'};
		}

		// Busca el usuario por email
		let user = await this.userRepository.findOne({
			where: {email},
			relations: ['redes'], // Cargar las redes sociales relacionadas
		});

		if (user) {
			// Verificar si ya tiene la red social asociada
			const socialNetwork = user.redes.find((network) => network.provider === provider && network.providerId === providerId);

			if (!socialNetwork) {
				// Si no tiene la red social asociada, la añadimos
				const newSocialNetwork = this.socialNetworkRepository.create({
					provider,
					providerId,
					profileUrl: userData.picture || userData.profile_image_url,
					user,
				});
				await this.socialNetworkRepository.save(newSocialNetwork);
			}

			// Enviar notificación de inicio de sesión
			this.emailService.sendNotification(user.email, 'Inicio de sesión en tu cuenta', 'src/emailTemplates/sessionNotification.html', {
				name: user.name,
				lastName: user.last_name,
				provider,
				resetPasswordUrl: 'https://tu-app.com/reset-password',
			});
		} else {
			// Si no existe el usuario, creamos uno nuevo
			user = this.userRepository.create({
				name: userData.given_name || userData.name || userData.givenName || '',
				last_name: userData.family_name || userData.surname || '',
				email: email,
				verificado: true,
				redes: [], // Iniciamos con redes vacías, las añadimos después
			});

			await this.userRepository.save(user);

			// Asociar la red social al nuevo usuario
			const newSocialNetwork = this.socialNetworkRepository.create({
				provider,
				providerId,
				profileUrl: userData.picture || userData.profile_image_url,
				user,
			});
			await this.socialNetworkRepository.save(newSocialNetwork);

			// Enviar correo de bienvenida
			this.emailService.sendNotification(user.email, 'Nuevo usuario registrado', 'src/emailTemplates/welcome_provaider.html', {
				name: user.name,
				lastName: user.last_name,
				email: user.email,
			});
		}

		// Autenticar al usuario y devolver el token
		return this.login(user);
	}

	async logout(userId: string) {
		// Para logout, simplemente necesitas eliminar el token del lado del cliente
		// No hay acción necesaria en el servidor, a menos que estés usando sesiones
		return {message: 'Logout successful'};
	}
}
