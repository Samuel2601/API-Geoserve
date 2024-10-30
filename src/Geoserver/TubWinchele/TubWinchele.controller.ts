import {Controller, Get, Post, Put, Delete, Param, Body, Query, DefaultValuePipe, ParseIntPipe} from '@nestjs/common';
import {TubWincheleService} from './TubWinchele.service';
import {TubWinchele} from 'src/entities/entities/TubWinchele';
import {parseFiltersTubWinchele} from './TubWinchele.dto';

@Controller('tub-winchele')
export class TubWincheleController {
	constructor(private readonly tubWincheleService: TubWincheleService) {}

	@Get()
	async findAll(
		@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
		@Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
		@Query('filter') filter: string,
		@Query('search') search?: string,
		@Query('fields') fields?: string,
	) {
		// Convertir el filtro de cadena a objeto
		const filters = parseFiltersTubWinchele(filter);
		// Convertir string de campos a array
		const selectFields = fields ? (fields.split(',').map((field) => field.trim()) as (keyof TubWinchele)[]) : [];
		return this.tubWincheleService.findAll(page, limit, filters, search, selectFields);
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
