import { Module } from '@nestjs/common';
import { SpatialRefSysController } from './SpatialRefSys.controller';
import { SpatialRefSysService } from './SpatialRefSys.service';
import { SpatialRefSys } from 'src/entities/entities/SpatialRefSys';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoordinateService } from 'src/common/coordinate/coordinate.service';

@Module({
  imports: [TypeOrmModule.forFeature([SpatialRefSys])],
  providers: [
    SpatialRefSysService,
    CoordinateService
  ],
  controllers: [SpatialRefSysController],
  exports: [SpatialRefSysService],
})
export class SpatialRefSysModule {}
