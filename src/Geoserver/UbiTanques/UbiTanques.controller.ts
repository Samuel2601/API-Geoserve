import {Controller, Get, Post, Put, Delete, Param, Body, Query, DefaultValuePipe, ParseIntPipe} from '@nestjs/common';
import {UbiTanquesService} from './UbiTanques.service';
import {UbiTanques} from 'src/entities/entities/UbiTanques';
import {parseFiltersUbiTanques} from './UbiTanques.dto';

@Controller('ubi-tanques')
export class UbiTanquesController {
	constructor(private readonly ubiTanquesService: UbiTanquesService) {}

	@Get()
	async findAll(
		@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
		@Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
		@Query('filter') filter: string,
		@Query('search') search?: string,
		@Query('fields') fields?: string,
	) {
		// Convertir el filtro de cadena a objeto
		const filters = parseFiltersUbiTanques(filter);
		// Convertir string de campos a array
		const selectFields = fields ? (fields.split(',').map((field) => field.trim()) as (keyof UbiTanques)[]) : [];
		return this.ubiTanquesService.findAll(page, limit, filters, search, selectFields);
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
