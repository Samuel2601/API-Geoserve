import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { TubWincheleService } from './TubWinchele.service';
import { TubWinchele } from 'src/entities/entities/TubWinchele';

@Controller('tub-winchele')
export class TubWincheleController {
  constructor(private readonly tubWincheleService: TubWincheleService) {}

  @Get()
  async findAll(): Promise<TubWinchele[]> {
    return this.tubWincheleService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<TubWinchele> {
    return this.tubWincheleService.findOne(id);
  }

  @Post()
  async create(@Body() tubWinchele: TubWinchele): Promise<TubWinchele> {
    return this.tubWincheleService.create(tubWinchele);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() tubWinchele: TubWinchele): Promise<TubWinchele> {
    return this.tubWincheleService.update(id, tubWinchele);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.tubWincheleService.remove(id);
  }
}
