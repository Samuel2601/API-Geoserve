import {Controller, Get, Post, Put, Delete, Param, Body, Query, DefaultValuePipe, ParseIntPipe} from '@nestjs/common';
import {GeoPredioGeneralService} from './GeoPredioGeneral.service';
import {GeoPredioGeneral} from 'src/entities/entities/GeoPredioGeneral';
import { parseFilters } from './GeoPredioGeneral.dto';

@Controller('geo-predio-general')
export class GeoPredioGeneralController {
	constructor(private readonly geoPredioGeneralService: GeoPredioGeneralService) {}

	@Get()
	async findAll(
		@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
		@Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
		@Query('filter') filter: string,
		@Query('search') search?: string,
	) {
		// Convertir el filtro de cadena a objeto
		const filters = parseFilters(filter);
		return this.geoPredioGeneralService.findAll(page, limit, filters, search);
	}


	@Get(':id')
	async findOne(@Param('id') id: string): Promise<GeoPredioGeneral> {
		return this.geoPredioGeneralService.findOne(id);
	}

	@Post()
	async create(@Body() geoPredioGeneral: GeoPredioGeneral): Promise<GeoPredioGeneral> {
		return this.geoPredioGeneralService.create(geoPredioGeneral);
	}

	@Put(':id')
	async update(@Param('id') id: string, @Body() geoPredioGeneral: GeoPredioGeneral): Promise<GeoPredioGeneral> {
		return this.geoPredioGeneralService.update(id, geoPredioGeneral);
	}

	@Delete(':id')
	async remove(@Param('id') id: string): Promise<void> {
		return this.geoPredioGeneralService.remove(id);
	}
}
