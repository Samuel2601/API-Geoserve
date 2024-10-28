import {Module} from '@nestjs/common';
import {PermisoController} from './permiso.controller';
import {PermisoService} from './permiso.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {NotificationsModule} from 'src/socket.io/notifications.module';
import {EmailModule} from 'src/common/email/email.module';
import {User} from 'src/entity/User.entity';
import {Permission} from 'src/entity/Permission.entity';
import {Role} from 'src/entity/Role.entity';
import {SocialNetwork} from 'src/entity/SocialNetwork.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([User, Role, Permission, SocialNetwork]), // Cambia MongooseModule por TypeOrmModule
		NotificationsModule,
		EmailModule,
	],
	providers: [PermisoService],
	controllers: [PermisoController],
	exports: [PermisoService],
})
export class PermisoModule {}
