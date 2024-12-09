import { Module } from '@nestjs/common';
import { TubWincheleController } from './TubWinchele.controller';
import { TubWincheleService } from './TubWinchele.service';
import { TubWinchele } from 'src/entities/entities/TubWinchele';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoordinateService } from 'src/common/coordinate/coordinate.service';

@Module({
  imports: [TypeOrmModule.forFeature([TubWinchele])],
  providers: [
    TubWincheleService,
    CoordinateService
  ],
  controllers: [TubWincheleController],
  exports: [TubWincheleService],
})
export class TubWincheleModule {}
