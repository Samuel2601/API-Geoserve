import { Controller, Get, Post, Put, Delete, Param, Body, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { AreaTanquesService } from './AreaTanques.service';
import { AreaTanques } from 'src/entities/entities/AreaTanques';
import { parseFiltersAreaTanques } from './AreaTanques.dto';


@Controller('area-tanques')
export class AreaTanquesController {
  constructor(private readonly areaTanquesService: AreaTanquesService) {}

  @Get()
	async findAll(
		@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
		@Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
		@Query('filter') filter: string,
		@Query('search') search?: string,
		@Query('fields') fields?: string,
	) {
		// Convertir el filtro de cadena a objeto
		const filters = parseFiltersAreaTanques(filter);
		// Convertir string de campos a array
		const selectFields = fields ? (fields.split(',').map((field) => field.trim()) as (keyof AreaTanques)[]) : [];
		return this.areaTanquesService.findAll(page, limit, filters, search,selectFields);
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
