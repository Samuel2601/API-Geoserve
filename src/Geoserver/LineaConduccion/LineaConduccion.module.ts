import { Module } from '@nestjs/common';
import { LineaConduccionController } from './LineaConduccion.controller';
import { LineaConduccionService } from './LineaConduccion.service';
import { LineaConducciN } from 'src/entities/entities/LineaConducciN';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([LineaConducciN])],
  providers: [
    LineaConduccionService,
  ],
  controllers: [LineaConduccionController],
  exports: [LineaConduccionService],
})
export class LineaConduccionModule {}
