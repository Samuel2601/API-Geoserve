import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {LineaConducciN} from 'src/entities/entities/LineaConducciN';
import {Repository} from 'typeorm';

@Injectable()
export class LineaConduccionService {
	constructor(
		@InjectRepository(LineaConducciN)
		private readonly lineaConduccionRepository: Repository<LineaConducciN>,
	) {}

	async findAll(
		page: number = 1,
		limit: number = 10,
		filters: Partial<LineaConducciN> = {},
		search?: string,
		selectedFields?: (keyof LineaConducciN)[], // Parámetro para seleccionar campos específicos
	): Promise<{
		data: LineaConducciN[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}> {
		try {
			// Validar parámetros de paginación
			if (page < 1) throw new BadRequestException('La página debe ser mayor a 0');
			if (limit < 1) throw new BadRequestException('El límite debe ser mayor a 0');

			const query = this.lineaConduccionRepository.createQueryBuilder('lineaConduccion');

			// Aplicar búsqueda general si existe
			if (search) {
				query.where('(lineaConduccion.diMetro ILIKE :search OR ' + 'lineaConduccion.descripci ILIKE :search)', {search: `%${search}%`});
			}

			// Aplicar filtros específicos
			console.log('Filtros:', filters);
			Object.keys(filters).forEach((key) => {
				if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
					// Manejo especial para campos numéricos
					if (key === 'id' || key === 'fid' || key === 'long') {
						query.andWhere(`lineaConduccion.${key} = :${key}`, {[key]: filters[key]});
					}
					// Búsqueda parcial para campos de texto
					else {
						query.andWhere(`lineaConduccion.${key} ILIKE :${key}`, {
							[key]: `%${filters[key]}%`,
						});
					}
				}
			});

			// Agregar ordenamiento
			query.orderBy('lineaConduccion.id', 'ASC');

			// Aplicar selección de campos
			console.log('Campos seleccionados:', selectedFields);
			if (selectedFields && selectedFields.length > 0) {
				query.select(selectedFields.map((field) => `lineaConduccion.${field}`));
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
			throw new Error(`Error al obtener las líneas de conducción: ${error.message}`);
		}
	}

	async findOne(id: number): Promise<LineaConducciN> {
		const linea = await this.lineaConduccionRepository.findOne({where: {id}});
		if (!linea) {
			throw new NotFoundException(`Linea con id ${id} no encontrada`);
		}
		return linea;
	}

	async create(lineaConduccion: LineaConducciN): Promise<LineaConducciN> {
		const newLineaConduccion = this.lineaConduccionRepository.create(lineaConduccion);
		return this.lineaConduccionRepository.save(newLineaConduccion);
	}

	async update(id: number, lineaConduccion: LineaConducciN): Promise<LineaConducciN> {
		await this.findOne(id); // Verifica si la línea existe
		await this.lineaConduccionRepository.update(id, lineaConduccion);
		return this.findOne(id);
	}

	async remove(id: number): Promise<void> {
		const linea = await this.findOne(id); // Verifica si la línea existe
		await this.lineaConduccionRepository.remove(linea);
	}
}
