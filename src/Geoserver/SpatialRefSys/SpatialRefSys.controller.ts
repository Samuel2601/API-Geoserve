import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { SpatialRefSysService } from './SpatialRefSys.service';
import { SpatialRefSys } from 'src/entities/entities/SpatialRefSys';

@Controller('spatial-ref-sys')
export class SpatialRefSysController {
  constructor(private readonly spatialRefSysService: SpatialRefSysService) {}

  @Get()
  async findAll(): Promise<SpatialRefSys[]> {
    return this.spatialRefSysService.findAll();
  }

  @Get(':srid')
  async findOne(@Param('srid') srid: number): Promise<SpatialRefSys> {
    return this.spatialRefSysService.findOne(srid);
  }

  @Post()
  async create(@Body() spatialRefSys: SpatialRefSys): Promise<SpatialRefSys> {
    return this.spatialRefSysService.create(spatialRefSys);
  }

  @Put(':srid')
  async update(@Param('srid') srid: number, @Body() spatialRefSys: SpatialRefSys): Promise<SpatialRefSys> {
    return this.spatialRefSysService.update(srid, spatialRefSys);
  }

  @Delete(':srid')
  async remove(@Param('srid') srid: number): Promise<void> {
    return this.spatialRefSysService.remove(srid);
  }
}
