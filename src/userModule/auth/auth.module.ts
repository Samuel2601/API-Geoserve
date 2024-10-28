import {Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {JwtModule} from '@nestjs/jwt';
import {HttpModule} from '@nestjs/axios';
import {EmailModule} from 'src/common/email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/User.entity';
import { SocialNetwork } from 'src/entity/SocialNetwork.entity';
import { Role } from 'src/entity/Role.entity';
import { Permission } from 'src/entity/Permission.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([User, Role, Permission,SocialNetwork]), // Cambia MongooseModule por TypeOrmModule
		JwtModule.register({
			secret: process.env.JWT_SECRET, // La clave secreta para firmar los tokens
			signOptions: {expiresIn: '60s'}, // Opciones de firma
		}),
		HttpModule,
		EmailModule, 
	],
	providers: [AuthService],
	controllers: [AuthController],
	exports: [AuthService],
})
export class AuthModule {}
