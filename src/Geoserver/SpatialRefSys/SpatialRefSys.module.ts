import { Module } from '@nestjs/common';
import { SpatialRefSysController } from './SpatialRefSys.controller';
import { SpatialRefSysService } from './SpatialRefSys.service';
import { SpatialRefSys } from 'src/entities/entities/SpatialRefSys';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([SpatialRefSys])],
  providers: [
    SpatialRefSysService,
  ],
  controllers: [SpatialRefSysController],
  exports: [SpatialRefSysService],
})
export class SpatialRefSysModule {}
