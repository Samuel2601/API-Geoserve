import {forwardRef, Module} from '@nestjs/common';
import {UserService} from './user.service';
import {UserController} from './user.controller';

import {RoleModule} from '../role/role.module';
import {NotificationsModule} from 'src/socket.io/notifications.module';
import {EmailModule} from 'src/common/email/email.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from 'src/entity/User.entity';
import {Role} from 'src/entity/Role.entity';
import {Permission} from 'src/entity/Permission.entity';
import {SocialNetwork} from 'src/entity/SocialNetwork.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([User, Role, Permission,SocialNetwork]), // Cambia MongooseModule por TypeOrmModule
		forwardRef(() => RoleModule),
		NotificationsModule,
		EmailModule,
	],
	providers: [UserService],
	controllers: [UserController],
	exports: [UserService],
})
export class UserModule {}
