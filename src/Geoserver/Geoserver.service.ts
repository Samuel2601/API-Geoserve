import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {UbiTanques} from 'src/entities/entities/UbiTanques';
import {Repository} from 'typeorm';

@Injectable()
export class GeoserverService {
	constructor(
		@InjectRepository(UbiTanques)
		private ubiTanquesRepository: Repository<UbiTanques>,
	) {}

	async findAll(): Promise<UbiTanques[]> {
		return await this.ubiTanquesRepository.find();
	}

	async findOne(id: number): Promise<UbiTanques | undefined> {
		return await this.ubiTanquesRepository.findOne({where: {id}});
	}

	// 1. Encontrar tanques a cierta distancia de un punto específico
	async findTanksWithinDistance(longitude: number, latitude: number, distance: number) {
		return this.ubiTanquesRepository.query(
			`SELECT * FROM "UBI_TANQUES" 
       WHERE ST_DWithin(geom, ST_SetSRID(ST_MakePoint($1, $2), 4326), $3)`,
			[longitude, latitude, distance],
		);
	}

	// 2. Encontrar tanques dentro de un área específica (polígono)
	async findTanksInPolygon(polygonWKT: string) {
		return this.ubiTanquesRepository.query(
			`SELECT * FROM "UBI_TANQUES" 
       WHERE ST_Intersects(geom, ST_GeomFromText($1, 4326))`,
			[polygonWKT],
		);
	}

	// 3. Calcular el área de cada tanque (si se representa como un polígono)
	async calculateArea() {
		return this.ubiTanquesRepository.query(
			`SELECT id, ST_Area(geom::geography) AS area_m2 
       FROM "UBI_TANQUES"`,
		);
	}

	// 4. Obtener el centroide de cada tanque
	async getCentroids() {
		return this.ubiTanquesRepository.query(
			`SELECT id, ST_Centroid(geom) AS centroide 
       FROM "UBI_TANQUES"`,
		);
	}

	// 5. Convertir coordenadas a otro sistema de referencia (por ejemplo, UTM)
	async convertToUTM() {
		return this.ubiTanquesRepository.query(
			`SELECT id, ST_Transform(geom, 32633) AS geom_utm 
       FROM "UBI_TANQUES"`,
		);
	}

	// 6. Verificar si una ubicación está dentro de la geometría de un tanque
	async isPointInTank(longitude: number, latitude: number) {
		return this.ubiTanquesRepository.query(
			`SELECT * FROM "UBI_TANQUES" 
       WHERE ST_Contains(geom, ST_SetSRID(ST_MakePoint($1, $2), 4326))`,
			[longitude, latitude],
		);
	}

	// 7. Ordenar tanques por proximidad a un punto específico
	async findTanksOrderedByDistance(longitude: number, latitude: number, limit: number = 10) {
		return this.ubiTanquesRepository.query(
			`SELECT id, geom, ST_Distance(geom, ST_SetSRID(ST_MakePoint($1, $2), 4326)) AS distance
       FROM "UBI_TANQUES"
       ORDER BY distance ASC
       LIMIT $3`,
			[longitude, latitude, limit],
		);
	}

	// 8. Crear un área de influencia (buffer) alrededor de cada tanque
	async createBuffer(bufferDistance: number) {
		return this.ubiTanquesRepository.query(
			`SELECT id, ST_Buffer(geom::geography, $1) AS buffer_area 
       FROM "UBI_TANQUES"`,
			[bufferDistance],
		);
	}
}
