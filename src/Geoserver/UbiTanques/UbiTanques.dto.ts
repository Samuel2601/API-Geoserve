import {IsOptional, IsString, IsNumber} from 'class-validator';

export class FilterUbiTanquesDto {
	@IsOptional()
	@IsNumber()
	id?: number;

	@IsOptional()
	@IsString()
	geom?: string;

	@IsOptional()
	@IsString()
	puntos?: string;

	@IsOptional()
	@IsNumber()
	x?: number;

	@IsOptional()
	@IsNumber()
	y?: number;

	@IsOptional()
	@IsString()
	sector?: string;

	@IsOptional()
	@IsNumber()
	cotaM?: number;

	@IsOptional()
	@IsNumber()
	volumenM?: number;

	@IsOptional()
	@IsString()
	capacidad?: string;

	@IsOptional()
	@IsString()
	numero?: string;
}

type FilterKeysUbiTanques = keyof FilterUbiTanquesDto;

// Función para verificar si una clave es válida
function isValidKeyUbiTanques(key: string): key is FilterKeysUbiTanques {
	return ['id', 'geom', 'puntos', 'x', 'y', 'sector', 'cotaM', 'volumenM', 'capacidad', 'numero'].includes(key);
}

// Función para asignar el valor correcto basado en el tipo
function assignValueUbiTanques(key: FilterKeysUbiTanques, value: string | undefined): string | number | undefined {
	if (!value) return undefined;

	const trimmedValue = value.trim();

	switch (key) {
		case 'id':
		case 'x':
		case 'y':
		case 'cotaM':
		case 'volumenM':
			return trimmedValue ? parseFloat(trimmedValue) : undefined;
		default:
			return trimmedValue;
	}
}

// Función para parsear filtros de un string a un objeto `FilterUbiTanquesDto`
export function parseFiltersUbiTanques(filter?: string): FilterUbiTanquesDto | undefined {
	if (!filter) return undefined;

	const cleanFilter = filter.replace(/[\[\]]/g, '');
	const filterPairs = cleanFilter.split(',').map((pair) => pair.split('='));

	const filters = {} as FilterUbiTanquesDto;

	for (const [key, value] of filterPairs) {
		const trimmedKey = key.trim();

		if (isValidKeyUbiTanques(trimmedKey)) {
			const typedValue = assignValueUbiTanques(trimmedKey, value);
			if (typedValue !== undefined) {
				(filters[trimmedKey] as any) = typedValue;
			}
		}
	}

	return filters;
}
