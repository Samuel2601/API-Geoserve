import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { LineaConduccionService } from './LineaConduccion.service';
import { LineaConducciN } from 'src/entities/entities/LineaConducciN';

@Controller('linea-conduccion')
export class LineaConduccionController {
  constructor(private readonly lineaConduccionService: LineaConduccionService) {}

  @Get()
  async findAll(): Promise<LineaConducciN[]> {
    return this.lineaConduccionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<LineaConducciN> {
    return this.lineaConduccionService.findOne(id);
  }

  @Post()
  async create(@Body() lineaConduccion: LineaConducciN): Promise<LineaConducciN> {
    return this.lineaConduccionService.create(lineaConduccion);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() lineaConduccion: LineaConducciN): Promise<LineaConducciN> {
    return this.lineaConduccionService.update(id, lineaConduccion);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.lineaConduccionService.remove(id);
  }
}
