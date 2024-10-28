import {Body, Query, Controller, Delete, Request, Get, Param, Post, NotFoundException, UnauthorizedException, ParseIntPipe} from '@nestjs/common';

import * as Dto from './Geoserver.dto';
import {UbiTanques} from 'src/entities/entities/UbiTanques';
import {GeoserverService} from './Geoserver.service';

@Controller('/geoserver')
export class GeoserverController {
	constructor(private readonly geoserverService: GeoserverService) {}
	@Get('tanques')
	async getAll(): Promise<UbiTanques[]> {
		return await this.geoserverService.findAll();
	}

	@Get(':id')
	async getById(@Param('id', ParseIntPipe) id: number): Promise<UbiTanques> {
		const tanques = await this.geoserverService.findOne(id);
		if (!tanques) {
			throw new NotFoundException(`Tanque with id ${id} not found`);
		}
		return tanques;
	}

	// 1. Encontrar tanques a cierta distancia de un punto específico
	@Get('tanks-within-distance')
	async getTanksWithinDistance(@Query('longitude') longitude: number, @Query('latitude') latitude: number, @Query('distance') distance: number) {
		return this.geoserverService.findTanksWithinDistance(longitude, latitude, distance);
	}

	// 2. Encontrar tanques dentro de un área específica (polígono)
	@Get('tanks-in-polygon')
	async getTanksInPolygon(@Query('polygonWKT') polygonWKT: string) {
		return this.geoserverService.findTanksInPolygon(polygonWKT);
	}

	// 3. Calcular el área de cada tanque (sin parámetros requeridos)
	@Get('calculate-area')
	async calculateArea() {
		return this.geoserverService.calculateArea();
	}

	// 4. Obtener el centroide de cada tanque (sin parámetros requeridos)
	@Get('/centroids')
	async getCentroids(): Promise<any> {
		// Cambia `any` si tienes un tipo definido
		return this.geoserverService.getCentroids();
	}

	// 5. Convertir coordenadas a otro sistema de referencia (sin parámetros requeridos)
	@Get('convert-to-utm')
	async convertToUTM() {
		return this.geoserverService.convertToUTM();
	}

	// 6. Verificar si una ubicación está dentro de la geometría de un tanque
	@Get('point-in-tank')
	async isPointInTank(@Query('longitude') longitude: number, @Query('latitude') latitude: number) {
		return this.geoserverService.isPointInTank(longitude, latitude);
	}

	// 7. Ordenar tanques por proximidad a un punto específico
	@Get('tanks-ordered-by-distance')
	async getTanksOrderedByDistance(@Query('longitude') longitude: number, @Query('latitude') latitude: number, @Query('limit') limit: number) {
		return this.geoserverService.findTanksOrderedByDistance(longitude, latitude, limit);
	}

	// 8. Crear un área de influencia (buffer) alrededor de cada tanque
	@Get('create-buffer')
	async createBuffer(@Query('bufferDistance') bufferDistance: number) {
		return this.geoserverService.createBuffer(bufferDistance);
	}
}
