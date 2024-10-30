import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {GeoPredioGeneral} from 'src/entities/entities/GeoPredioGeneral';
import {Repository} from 'typeorm';

@Injectable()
export class GeoPredioGeneralService {
	constructor(
		@InjectRepository(GeoPredioGeneral)
		private readonly geoPredioGeneralRepository: Repository<GeoPredioGeneral>,
	) {}

	async findAll(
		page: number = 1,
		limit: number = 10,
		filters: Partial<GeoPredioGeneral> = {},
		search?: string,
		selectedFields?: (keyof GeoPredioGeneral)[], // Nuevo parámetro para seleccionar campos específicos
	): Promise<{
		data: GeoPredioGeneral[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}> {
		try {
			// Validar parámetros de paginación
			if (page < 1) throw new BadRequestException('La página debe ser mayor a 0');
			if (limit < 1) throw new BadRequestException('El límite debe ser mayor a 0');

			const query = this.geoPredioGeneralRepository.createQueryBuilder('geoPredioGeneral');

			// Aplicar búsqueda general si existe
			if (search) {
				query.where(
					'(geoPredioGeneral.claveCatastral ILIKE :search OR ' +
						'geoPredioGeneral.claveCatastralAnterior ILIKE :search OR ' +
						'geoPredioGeneral.propietario ILIKE :search OR ' +
						'geoPredioGeneral.tipoPredio ILIKE :search )',
					{
						search: `%${search}%`,
					},
				);
			}

			// Aplicar filtros específicos
			console.log('Filtros:', filters);
			Object.keys(filters).forEach((key) => {
				if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
					// Manejo especial para campos numéricos
					if (key === 'area' || key === 'id') {
						query.andWhere(`geoPredioGeneral.${key} = :${key}`, {[key]: filters[key]});
					}
					// Búsqueda parcial para campos de texto
					else {
						query.andWhere(`geoPredioGeneral.${key} ILIKE :${key}`, {
							[key]: `%${filters[key]}%`,
						});
					}
				}
			});

			// Agregar ordenamiento
			query.orderBy('geoPredioGeneral.id', 'ASC');

			// Aplicar selección de campos
			console.log('seleccionados:', selectedFields);
			if (selectedFields && selectedFields.length > 0) {
				query.select(selectedFields.map((field) => `geoPredioGeneral.${field}`));
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
			throw new Error(`Error al obtener los predios: ${error.message}`);
		}
	}

	async findOne(id: string): Promise<GeoPredioGeneral> {
		const predio = await this.geoPredioGeneralRepository.findOne({where: {id}});
		if (!predio) {
			throw new NotFoundException(`Predio con id ${id} no encontrado`);
		}
		return predio;
	}

	async create(geoPredioGeneral: GeoPredioGeneral): Promise<GeoPredioGeneral> {
		const newGeoPredioGeneral = this.geoPredioGeneralRepository.create(geoPredioGeneral);
		return this.geoPredioGeneralRepository.save(newGeoPredioGeneral);
	}

	async update(id: string, geoPredioGeneral: GeoPredioGeneral): Promise<GeoPredioGeneral> {
		await this.findOne(id); // Verifica si el predio existe
		await this.geoPredioGeneralRepository.update(id, geoPredioGeneral);
		return this.findOne(id);
	}

	async remove(id: string): Promise<void> {
		const predio = await this.findOne(id); // Verifica si el predio existe
		await this.geoPredioGeneralRepository.remove(predio);
	}
}
