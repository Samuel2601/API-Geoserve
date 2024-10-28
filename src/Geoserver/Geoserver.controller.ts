import {Body, Query, Controller, Delete, Request, Get, Param, Post, NotFoundException, UnauthorizedException, ParseIntPipe} from '@nestjs/common';

import * as Dto from './Geoserver.dto';
import {UbiTanques} from 'src/entities/entities/UbiTanques';
import {GeoserverService} from './Geoserver.service';

@Controller('/geoserver')
export class GeoserverController {
	constructor(private readonly ubiTanquesService: GeoserverService) {}
	@Get()
	async getAll(): Promise<UbiTanques[]> {
		return await this.ubiTanquesService.findAll();
	}

	@Get(':id')
	async getById(@Param('id', ParseIntPipe) id: number): Promise<UbiTanques> {
		const tanques = await this.ubiTanquesService.findOne(id);
		if (!tanques) {
			throw new NotFoundException(`Tanque with id ${id} not found`);
		}
		return tanques;
	}
}
