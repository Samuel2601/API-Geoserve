import { CoordinateService } from './common/coordinate/coordinate.service';
import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {DatabaseModule} from './database/database.module';
import { GeoserverModule } from './Geoserver/Geoserver.module';

@Module({
	imports: [GeoserverModule,DatabaseModule],
	controllers: [AppController],
	providers: [
        CoordinateService, AppService],
})
export class AppModule {}
