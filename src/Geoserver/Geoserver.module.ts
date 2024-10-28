import {Module} from '@nestjs/common';
import {GeoserverController} from './Geoserver.controller';
import {GeoserverService} from './Geoserver.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UbiTanques} from 'src/entities/entities/UbiTanques';
import {TubWinchele} from 'src/entities/entities/TubWinchele';
import {SpatialRefSys} from 'src/entities/entities/SpatialRefSys';
import {LineaConducciN} from 'src/entities/entities/LineaConducciN';
import {AreaTanques} from 'src/entities/entities/AreaTanques';

@Module({
	imports: [TypeOrmModule.forFeature([UbiTanques, TubWinchele, SpatialRefSys, LineaConducciN, AreaTanques])],
	providers: [GeoserverService],
	controllers: [GeoserverController],
	exports: [GeoserverService],
})
export class GeoserverModule {}
