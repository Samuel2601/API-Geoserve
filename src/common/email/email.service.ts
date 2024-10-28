import {Injectable} from '@nestjs/common';
import * as nodemailer from 'nodemailer'; // Usa * para importar todo el módulo de nodemailer
import * as fs from 'fs'; // Asegúrate de usar la forma correcta para importar módulos nativos de Node.js
import * as handlebars from 'handlebars';

@Injectable()
export class EmailService {
	private transporter: nodemailer.Transporter; // Usa el tipo correcto para el transporter

	constructor() {
		this.transporter = nodemailer.createTransport({
			host: process.env.MAIL_HOST,
			port: Number(process.env.MAIL_PORT), // Asegúrate de convertir a número
			secure: true,
			auth: {
				user: process.env.MAIL_USER,
				pass: process.env.MAIL_PASS,
			},
		});
	}

	async sendNotification(to: string, subject: string, templatePath: string, templateData: any) {
		try {
			// Lee el archivo HTML
			const html = await this.readHTMLFile(templatePath);
			// Compón el contenido del correo
			const template = handlebars.compile(html);
			const htmlToSend = template(templateData);

			const mailOptions = {
				from: 'aplicaciones@esmeraldas.gob.ec',
				to,
				subject,
				html: htmlToSend,
			};

			// Envía el correo
			await this.transporter.sendMail(mailOptions);
			console.log('Email sent successfully');
		} catch (error) {
			console.error('Error sending email:', error);
		}
	}

	private readHTMLFile(filePath: string): Promise<string> {
		return new Promise((resolve, reject) => {
			fs.readFile(filePath, {encoding: 'utf-8'}, (err, html) => {
				if (err) {
					return reject(err);
				}
				resolve(html);
			});
		});
	}
}
