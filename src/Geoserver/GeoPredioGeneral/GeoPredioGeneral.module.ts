import { Module } from '@nestjs/common';
import { GeoPredioGeneralController } from './GeoPredioGeneral.controller';
import { GeoPredioGeneralService } from './GeoPredioGeneral.service';
import { GeoPredioGeneral } from 'src/entities/entities/GeoPredioGeneral';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoordinateService } from 'src/common/coordinate/coordinate.service';

@Module({
  imports: [TypeOrmModule.forFeature([GeoPredioGeneral])],
  providers: [
    GeoPredioGeneralService,
    CoordinateService
  ],
  controllers: [GeoPredioGeneralController],
  exports: [GeoPredioGeneralService],
})
export class GeoPredioGeneralModule {}
