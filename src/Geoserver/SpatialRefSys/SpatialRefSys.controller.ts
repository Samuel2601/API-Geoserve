import {Controller, Get, Post, Put, Delete, Param, Body, Query, DefaultValuePipe, ParseIntPipe} from '@nestjs/common';
import {SpatialRefSysService} from './SpatialRefSys.service';
import {SpatialRefSys} from 'src/entities/entities/SpatialRefSys';
import {parseFiltersSpatialRefSys} from './SpatialRefSys.dto';

@Controller('spatial-ref-sys')
export class SpatialRefSysController {
	constructor(private readonly spatialRefSysService: SpatialRefSysService) {}

	@Get()
	async findAll(
		@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
		@Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
		@Query('filter') filter: string,
		@Query('search') search?: string,
		@Query('fields') fields?: string,
	) {
		// Convertir el filtro de cadena a objeto
		const filters = parseFiltersSpatialRefSys(filter);
		// Convertir string de campos a array
		const selectFields = fields ? (fields.split(',').map((field) => field.trim()) as (keyof SpatialRefSys)[]) : [];
		return this.spatialRefSysService.findAll(page, limit, filters, search, selectFields);
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
