import { Module } from '@nestjs/common';
import { AreaTanquesController } from './AreaTanques.controller';
import { AreaTanquesService } from './AreaTanques.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AreaTanques } from 'src/entities/entities/AreaTanques';
import { CoordinateService } from 'src/common/coordinate/coordinate.service';

@Module({
  imports: [TypeOrmModule.forFeature([AreaTanques])],
  providers: [
    AreaTanquesService,
    CoordinateService
  ],
  controllers: [AreaTanquesController],
  exports: [AreaTanquesService],
})
export class AreaTanquesModule {}
