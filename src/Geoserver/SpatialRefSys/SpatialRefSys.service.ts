import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {SpatialRefSys} from 'src/entities/entities/SpatialRefSys';
import {Repository} from 'typeorm';

@Injectable()
export class SpatialRefSysService {
	constructor(
		@InjectRepository(SpatialRefSys)
		private readonly spatialRefSysRepository: Repository<SpatialRefSys>,
	) {}

	async findAll(
		page: number = 1,
		limit: number = 10,
		filters: Partial<SpatialRefSys> = {},
		search?: string,
		selectedFields?: (keyof SpatialRefSys)[], // Parámetro para seleccionar campos específicos
	): Promise<{
		data: SpatialRefSys[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}> {
		try {
			// Validar parámetros de paginación
			if (page < 1) throw new BadRequestException('La página debe ser mayor a 0');
			if (limit < 1) throw new BadRequestException('El límite debe ser mayor a 0');

			const query = this.spatialRefSysRepository.createQueryBuilder('spatialRefSys');

			// Aplicar búsqueda general si existe
			if (search) {
				query.where('(spatialRefSys.authName ILIKE :search OR ' + 'spatialRefSys.srtext ILIKE :search OR ' + 'spatialRefSys.proj4text ILIKE :search)', {search: `%${search}%`});
			}

			// Aplicar filtros específicos
			console.log('Filtros:', filters);
			Object.keys(filters).forEach((key) => {
				if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
					// Manejo especial para campos numéricos
					if (key === 'srid' || key === 'authSrid') {
						query.andWhere(`spatialRefSys.${key} = :${key}`, {[key]: filters[key]});
					}
					// Búsqueda parcial para campos de texto
					else {
						query.andWhere(`spatialRefSys.${key} ILIKE :${key}`, {
							[key]: `%${filters[key]}%`,
						});
					}
				}
			});

			// Agregar ordenamiento
			query.orderBy('spatialRefSys.srid', 'ASC');

			// Aplicar selección de campos
			console.log('Campos seleccionados:', selectedFields);
			if (selectedFields && selectedFields.length > 0) {
				query.select(selectedFields.map((field) => `spatialRefSys.${field}`));
			}

			// Aplicar paginación
			const skip = (page - 1) * limit;
			query.skip(skip).take(limit);

			// Ejecutar consulta
			const [data, total] = await query.getManyAndCount();

			// Calcular total de páginas
			const totalPages = Math.ceil(total / limit);

			return {
				data,
				total,
				page,
				limit,
				totalPages,
			};
		} catch (error) {
			if (error instanceof BadRequestException) throw error;
			throw new Error(`Error al obtener los sistemas de referencia espacial: ${error.message}`);
		}
	}

	async findOne(srid: number): Promise<SpatialRefSys> {
		const spatialRefSys = await this.spatialRefSysRepository.findOne({where: {srid}});
		if (!spatialRefSys) {
			throw new NotFoundException(`Sistema de referencia con SRID ${srid} no encontrado`);
		}
		return spatialRefSys;
	}

	async create(spatialRefSys: SpatialRefSys): Promise<SpatialRefSys> {
		const newSpatialRefSys = this.spatialRefSysRepository.create(spatialRefSys);
		return this.spatialRefSysRepository.save(newSpatialRefSys);
	}

	async update(srid: number, spatialRefSys: SpatialRefSys): Promise<SpatialRefSys> {
		await this.findOne(srid); // Verifica si el SRID existe
		await this.spatialRefSysRepository.update(srid, spatialRefSys);
		return this.findOne(srid);
	}

	async remove(srid: number): Promise<void> {
		const spatialRefSys = await this.findOne(srid); // Verifica si el SRID existe
		await this.spatialRefSysRepository.remove(spatialRefSys);
	}
}
