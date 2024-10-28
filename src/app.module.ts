import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {UserAppModule} from './userModule/userApp.module';
import {DatabaseModule} from './database/database.module';

@Module({
	imports: [UserAppModule, DatabaseModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
