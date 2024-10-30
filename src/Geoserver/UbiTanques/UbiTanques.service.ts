import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {UbiTanques} from 'src/entities/entities/UbiTanques';
import {Repository} from 'typeorm';

@Injectable()
export class UbiTanquesService {
	constructor(
		@InjectRepository(UbiTanques)
		private readonly ubiTanquesRepository: Repository<UbiTanques>,
	) {}

	async findAll(
		page: number = 1,
		limit: number = 10,
		filters: Partial<UbiTanques> = {},
		search?: string,
		selectedFields?: (keyof UbiTanques)[], // Parámetro para seleccionar campos específicos
	): Promise<{
		data: UbiTanques[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}> {
		try {
			// Validar parámetros de paginación
			if (page < 1) throw new BadRequestException('La página debe ser mayor a 0');
			if (limit < 1) throw new BadRequestException('El límite debe ser mayor a 0');

			const query = this.ubiTanquesRepository.createQueryBuilder('ubiTanques');

			// Aplicar búsqueda general si existe
			if (search) {
				query.where(
					'(ubiTanques.puntos ILIKE :search OR ' + 'ubiTanques.sector ILIKE :search OR ' + 'ubiTanques.capacidad ILIKE :search OR ' + 'ubiTanques.numero ILIKE :search)',
					{search: `%${search}%`},
				);
			}

			// Aplicar filtros específicos
			console.log('Filtros:', filters);
			Object.keys(filters).forEach((key) => {
				if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
					// Manejo especial para campos numéricos
					if (['id', 'x', 'y', 'cotaM', 'volumenM'].includes(key)) {
						query.andWhere(`ubiTanques.${key} = :${key}`, {[key]: filters[key]});
					} else {
						query.andWhere(`ubiTanques.${key} ILIKE :${key}`, {
							[key]: `%${filters[key]}%`,
						});
					}
				}
			});

			// Agregar ordenamiento
			query.orderBy('ubiTanques.id', 'ASC');

			// Aplicar selección de campos
			console.log('Campos seleccionados:', selectedFields);
			if (selectedFields && selectedFields.length > 0) {
				query.select(selectedFields.map((field) => `ubiTanques.${field}`));
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
			throw new Error(`Error al obtener los registros de UbiTanques: ${error.message}`);
		}
	}

	async findOne(id: number): Promise<UbiTanques> {
		const ubiTanques = await this.ubiTanquesRepository.findOne({where: {id}});
		if (!ubiTanques) {
			throw new NotFoundException(`UbiTanques con ID ${id} no encontrado`);
		}
		return ubiTanques;
	}

	async create(ubiTanques: UbiTanques): Promise<UbiTanques> {
		const newUbiTanques = this.ubiTanquesRepository.create(ubiTanques);
		return this.ubiTanquesRepository.save(newUbiTanques);
	}

	async update(id: number, ubiTanques: UbiTanques): Promise<UbiTanques> {
		await this.findOne(id); // Verifica si el ID existe
		await this.ubiTanquesRepository.update(id, ubiTanques);
		return this.findOne(id);
	}

	async remove(id: number): Promise<void> {
		const ubiTanques = await this.findOne(id); // Verifica si el ID existe
		await this.ubiTanquesRepository.remove(ubiTanques);
	}
}
