import { Module } from '@nestjs/common';
import { LineaConduccionController } from './LineaConduccion.controller';
import { LineaConduccionService } from './LineaConduccion.service';
import { LineaConducciN } from 'src/entities/entities/LineaConducciN';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoordinateService } from 'src/common/coordinate/coordinate.service';

@Module({
  imports: [TypeOrmModule.forFeature([LineaConducciN])],
  providers: [
    LineaConduccionService,
    CoordinateService
  ],
  controllers: [LineaConduccionController],
  exports: [LineaConduccionService],
})
export class LineaConduccionModule {}
