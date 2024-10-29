import { Module } from '@nestjs/common';
import { UbiTanquesController } from './UbiTanques.controller';
import { UbiTanquesService } from './UbiTanques.service';
import { UbiTanques } from 'src/entities/entities/UbiTanques';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UbiTanques])],
  providers: [
    UbiTanquesService,
  ],
  controllers: [UbiTanquesController],
  exports: [UbiTanquesService],
})
export class UbiTanquesModule {}
