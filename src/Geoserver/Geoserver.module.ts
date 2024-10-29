import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UbiTanques} from 'src/entities/entities/UbiTanques';
import {TubWinchele} from 'src/entities/entities/TubWinchele';
import {SpatialRefSys} from 'src/entities/entities/SpatialRefSys';
import {LineaConducciN} from 'src/entities/entities/LineaConducciN';
import {AreaTanques} from 'src/entities/entities/AreaTanques';
import {GeoPredioGeneral} from 'src/entities/entities/GeoPredioGeneral';
import {AreaTanquesModule} from './AreaTanques/AreaTanques.module';
import {GeoPredioGeneralModule} from './GeoPredioGeneral/GeoPredioGeneral.module';
import {LineaConduccionModule} from './LineaConduccion/LineaConduccion.module';
import {SpatialRefSysModule} from './SpatialRefSys/SpatialRefSys.module';
import {TubWincheleModule} from './TubWinchele/TubWinchele.module';
import {UbiTanquesModule} from './UbiTanques/UbiTanques.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([UbiTanques, TubWinchele, SpatialRefSys, LineaConducciN, AreaTanques, GeoPredioGeneral]),
		AreaTanquesModule,
		GeoPredioGeneralModule,
		LineaConduccionModule,
		SpatialRefSysModule,
		TubWincheleModule,
		UbiTanquesModule,
	],
	providers: [],
	controllers: [],
	exports: [TypeOrmModule],
})
export class GeoserverModule {}
