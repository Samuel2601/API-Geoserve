import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import { CoordinateService } from 'src/common/coordinate/coordinate.service';
import {TubWinchele} from 'src/entities/entities/TubWinchele';
import {Repository} from 'typeorm';

@Injectable()
export class TubWincheleService {
	constructor(
		@InjectRepository(TubWinchele)
		private readonly tubWincheleRepository: Repository<TubWinchele>,
		private readonly convergerService: CoordinateService,
	) {}

	async findAll(
		page: number = 1,
		limit: number = 10,
		filters: Partial<TubWinchele> = {},
		search?: string,
		selectedFields?: (keyof TubWinchele)[], // Parámetro para seleccionar campos específicos
	): Promise<{
		data: TubWinchele[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}> {
		try {
			// Validar parámetros de paginación
			if (page < 1) throw new BadRequestException('La página debe ser mayor a 0');
			if (limit < 1) throw new BadRequestException('El límite debe ser mayor a 0');

			const query = this.tubWincheleRepository.createQueryBuilder('tubWinchele');

			// Aplicar búsqueda general si existe
			if (search) {
				query.where(
					'(tubWinchele.entity ILIKE :search OR ' +
						'tubWinchele.layer ILIKE :search OR ' +
						'tubWinchele.linetype ILIKE :search OR ' +
						'tubWinchele.refname ILIKE :search OR ' +
						'tubWinchele.e22 ILIKE :search OR ' +
						'tubWinchele.diametro ILIKE :search OR ' +
						'tubWinchele.tanque ILIKE :search OR ' +
						'tubWinchele.canton ILIKE :search)',
					{search: `%${search}%`},
				);
			}

			// Aplicar filtros específicos
			console.log('Filtros:', filters);
			Object.keys(filters).forEach((key) => {
				if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
					// Manejo especial para campos numéricos
					if (['id', 'fid', 'color', 'linewt', 'nivel'].includes(key)) {
						query.andWhere(`tubWinchele.${key} = :${key}`, {[key]: filters[key]});
					} else {
						query.andWhere(`tubWinchele.${key} ILIKE :${key}`, {
							[key]: `%${filters[key]}%`,
						});
					}
				}
			});

			// Agregar ordenamiento
			query.orderBy('tubWinchele.id', 'ASC');

			// Aplicar selección de campos
			console.log('Campos seleccionados:', selectedFields);
			if (selectedFields && selectedFields.length > 0) {
				query.select(selectedFields.map((field) => `tubWinchele.${field}`));
			}

			// Aplicar paginación
			const skip = (page - 1) * limit;
			query.skip(skip).take(limit);

			// Ejecutar consulta
			const [rawData, total] = await query.getManyAndCount();

			const data = this.convergerService.convertCoordinates(rawData);

			// Calcular total de páginas
			const totalPages = Math.ceil(total / limit);
			console.log(total);
			return {
				data,
				total,
				page,
				limit,
				totalPages,
			};
		} catch (error) {
			if (error instanceof BadRequestException) throw error;
			throw new Error(`Error al obtener los registros de TubWinchele: ${error.message}`);
		}
	}
	async findOne(id: number): Promise<TubWinchele> {
		const tubWinchele = await this.tubWincheleRepository.findOne({where: {id}});
		if (!tubWinchele) {
			throw new NotFoundException(`TubWinchele con ID ${id} no encontrado`);
		}
		return tubWinchele;
	}

	async create(tubWinchele: TubWinchele): Promise<TubWinchele> {
		const newTubWinchele = this.tubWincheleRepository.create(tubWinchele);
		return this.tubWincheleRepository.save(newTubWinchele);
	}

	async update(id: number, tubWinchele: TubWinchele): Promise<TubWinchele> {
		await this.findOne(id); // Verifica si el ID existe
		await this.tubWincheleRepository.update(id, tubWinchele);
		return this.findOne(id);
	}

	async remove(id: number): Promise<void> {
		const tubWinchele = await this.findOne(id); // Verifica si el ID existe
		await this.tubWincheleRepository.remove(tubWinchele);
	}
}
