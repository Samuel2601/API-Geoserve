import { Controller, Get, Post, Put, Delete, Param, Body, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { LineaConduccionService } from './LineaConduccion.service';
import { LineaConducciN } from 'src/entities/entities/LineaConducciN';
import { parseFiltersLineaConduccion } from './LineaConduccion.dto';

@Controller('linea-conduccion')
export class LineaConduccionController {
  constructor(private readonly lineaConduccionService: LineaConduccionService) {}

  @Get()
	async findAll(
		@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
		@Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
		@Query('filter') filter: string,
		@Query('search') search?: string,
		@Query('fields') fields?: string,
	) {
		// Convertir el filtro de cadena a objeto
		const filters = parseFiltersLineaConduccion(filter);
		// Convertir string de campos a array
		const selectFields = fields ? (fields.split(',').map((field) => field.trim()) as (keyof LineaConducciN)[]) : [];
		return this.lineaConduccionService.findAll(page, limit, filters, search,selectFields);
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
