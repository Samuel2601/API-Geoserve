import { Module } from '@nestjs/common';
import { AreaTanquesController } from './AreaTanques.controller';
import { AreaTanquesService } from './AreaTanques.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AreaTanques } from 'src/entities/entities/AreaTanques';

@Module({
  imports: [TypeOrmModule.forFeature([AreaTanques])],
  providers: [
    AreaTanquesService,
  ],
  controllers: [AreaTanquesController],
  exports: [AreaTanquesService],
})
export class AreaTanquesModule {}
