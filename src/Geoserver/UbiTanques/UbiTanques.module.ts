import { Module } from '@nestjs/common';
import { UbiTanquesController } from './UbiTanques.controller';
import { UbiTanquesService } from './UbiTanques.service';
import { UbiTanques } from 'src/entities/entities/UbiTanques';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoordinateService } from 'src/common/coordinate/coordinate.service';

@Module({
  imports: [TypeOrmModule.forFeature([UbiTanques])],
  providers: [
    UbiTanquesService,
    CoordinateService
  ],
  controllers: [UbiTanquesController],
  exports: [UbiTanquesService],
})
export class UbiTanquesModule {}
