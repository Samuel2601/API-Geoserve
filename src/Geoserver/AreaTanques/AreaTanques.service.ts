import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {AreaTanques} from 'src/entities/entities/AreaTanques';
import {Repository} from 'typeorm';

@Injectable()
export class AreaTanquesService {
	constructor(
		@InjectRepository(AreaTanques)
		private readonly areaTanquesRepository: Repository<AreaTanques>,
	) {}

	async findAll(
		page: number = 1,
		limit: number = 10,
		filters: Partial<AreaTanques> = {},
		search?: string,
		selectedFields?: (keyof AreaTanques)[], // Parámetro para seleccionar campos específicos
	): Promise<{
		data: AreaTanques[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}> {
		try {
			// Validar parámetros de paginación
			if (page < 1) throw new BadRequestException('La página debe ser mayor a 0');
			if (limit < 1) throw new BadRequestException('El límite debe ser mayor a 0');

			const query = this.areaTanquesRepository.createQueryBuilder('areaTanques');

			// Aplicar búsqueda general si existe
			if (search) {
				query.where(
					'(areaTanques.nomTanque ILIKE :search OR ' +
						'areaTanques.orden ILIKE :search OR ' +
						'areaTanques.sector ILIKE :search OR ' +
						'areaTanques.capacidad ILIKE :search OR ' +
						'areaTanques.numero ILIKE :search)',
					{search: `%${search}%`},
				);
			}

			// Aplicar filtros específicos
			console.log('Filtros:', filters);
			Object.keys(filters).forEach((key) => {
				if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
					// Manejo especial para campos numéricos
					if (key === 'id') {
						query.andWhere(`areaTanques.${key} = :${key}`, {[key]: filters[key]});
					}
					// Búsqueda parcial para campos de texto
					else {
						query.andWhere(`areaTanques.${key} ILIKE :${key}`, {
							[key]: `%${filters[key]}%`,
						});
					}
				}
			});

			// Agregar ordenamiento
			query.orderBy('areaTanques.id', 'ASC');

			// Aplicar selección de campos
			console.log('Campos seleccionados:', selectedFields);
			if (selectedFields && selectedFields.length > 0) {
				query.select(selectedFields.map((field) => `areaTanques.${field}`));
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
			throw new Error(`Error al obtener los tanques: ${error.message}`);
		}
	}

	async findOne(id: number): Promise<AreaTanques> {
		const tanque = await this.areaTanquesRepository.findOne({where: {id}});
		if (!tanque) {
			throw new NotFoundException(`Tanque con id ${id} no encontrado`);
		}
		return tanque;
	}

	async create(areaTanques: AreaTanques): Promise<AreaTanques> {
		const newAreaTanques = this.areaTanquesRepository.create(areaTanques);
		return this.areaTanquesRepository.save(newAreaTanques);
	}

	async update(id: number, areaTanques: AreaTanques): Promise<AreaTanques> {
		await this.findOne(id); // Verifica si el tanque existe
		await this.areaTanquesRepository.update(id, areaTanques);
		return this.findOne(id);
	}

	async remove(id: number): Promise<void> {
		const tanque = await this.findOne(id); // Verifica si el tanque existe
		await this.areaTanquesRepository.remove(tanque);
	}
}
