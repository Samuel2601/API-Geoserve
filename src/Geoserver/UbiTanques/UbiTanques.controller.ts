import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { UbiTanquesService } from './UbiTanques.service';
import { UbiTanques } from 'src/entities/entities/UbiTanques';

@Controller('ubi-tanques')
export class UbiTanquesController {
  constructor(private readonly ubiTanquesService: UbiTanquesService) {}

  @Get()
  async findAll(): Promise<UbiTanques[]> {
    return this.ubiTanquesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<UbiTanques> {
    return this.ubiTanquesService.findOne(id);
  }

  @Post()
  async create(@Body() ubiTanques: UbiTanques): Promise<UbiTanques> {
    return this.ubiTanquesService.create(ubiTanques);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() ubiTanques: UbiTanques): Promise<UbiTanques> {
    return this.ubiTanquesService.update(id, ubiTanques);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.ubiTanquesService.remove(id);
  }
}
