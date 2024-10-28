import {Module} from '@nestjs/common';
import {UserModule} from './user/user.module';
import {RoleModule} from './role/role.module';
import {NotificationsModule} from 'src/socket.io/notifications.module';
import {EmailModule} from 'src/common/email/email.module';
import {UploadsModule} from 'src/common/uploads/uploads.module';
import {AuthModule} from './auth/auth.module';
import {PermisoModule} from './permiso/permiso.module';
import {TypeOrmModule} from '@nestjs/typeorm'; // Importa TypeOrmModule
import {User} from 'src/entity/User.entity';
import {Role} from 'src/entity/Role.entity';
import {Permission} from 'src/entity/Permission.entity';
import { SocialNetwork } from 'src/entity/SocialNetwork.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([User, Role, Permission,SocialNetwork]), // Cambia MongooseModule por TypeOrmModule
		UserModule,
		RoleModule,
		PermisoModule,
		NotificationsModule,
		EmailModule,
		UploadsModule,
		AuthModule,
	],
	providers: [],
	controllers: [],
	exports: [TypeOrmModule], // Cambia MongooseModule por TypeOrmModule
})
export class UserAppModule {}
