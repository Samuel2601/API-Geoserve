import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { AreaTanquesService } from './AreaTanques.service';
import { AreaTanques } from 'src/entities/entities/AreaTanques';


@Controller('area-tanques')
export class AreaTanquesController {
  constructor(private readonly areaTanquesService: AreaTanquesService) {}

  @Get()
  async findAll(): Promise<AreaTanques[]> {
    return this.areaTanquesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<AreaTanques> {
    return this.areaTanquesService.findOne(id);
  }

  @Post()
  async create(@Body() areaTanques: AreaTanques): Promise<AreaTanques> {
    return this.areaTanquesService.create(areaTanques);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() areaTanques: AreaTanques,
  ): Promise<AreaTanques> {
    return this.areaTanquesService.update(id, areaTanques);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.areaTanquesService.remove(id);
  }
}
