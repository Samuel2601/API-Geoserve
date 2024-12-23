import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule, ConfigService} from '@nestjs/config';
import { UbiTanques } from 'src/entities/entities/UbiTanques';
import { AreaTanques } from 'src/entities/entities/AreaTanques';
import { GeoPredioGeneral } from 'src/entities/entities/GeoPredioGeneral';
import { LineaConducciN } from 'src/entities/entities/LineaConducciN';
import { SpatialRefSys } from 'src/entities/entities/SpatialRefSys';
import { TubWinchele } from 'src/entities/entities/TubWinchele';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true, // Para que el módulo de configuración esté disponible en todo el proyecto
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				type: 'postgres',
				host: configService.get<string>('POSTGRES_HOST'),
				port: configService.get<number>('POSTGRES_PORT'),
				username: configService.get<string>('POSTGRES_USER'),
				password: configService.get<string>('POSTGRES_PASSWORD'),
				database: configService.get<string>('POSTGRES_DB'),
				schema: configService.get<string>('POSTGRES_SCHEMA'),
				entities: [AreaTanques, GeoPredioGeneral, LineaConducciN, SpatialRefSys, TubWinchele, UbiTanques], // Asegúrate de especificar correctamente el path a tus entidades
				synchronize: false, // Solo para desarrollo, en producción desactiva esto
			}),
			inject: [ConfigService],
		}),
	],
})
export class DatabaseModule {}
