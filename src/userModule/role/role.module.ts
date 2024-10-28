import {forwardRef, Module} from '@nestjs/common';
import {RoleController} from './role.controller';
import {RoleService} from './role.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {NotificationsModule} from 'src/socket.io/notifications.module';
import {PermisoModule} from '../permiso/permiso.module';
import {User} from 'src/entity/User.entity';
import {Permission} from 'src/entity/Permission.entity';
import {Role} from 'src/entity/Role.entity';
import {SocialNetwork} from 'src/entity/SocialNetwork.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([User, Role, Permission, SocialNetwork]), // Cambia MongooseModule por TypeOrmModule
		forwardRef(() => PermisoModule),
		NotificationsModule,
	],
	providers: [RoleService],
	controllers: [RoleController],
	exports: [RoleService],
})
export class RoleModule {}
