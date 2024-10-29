import {IsOptional, IsString, IsNumber} from 'class-validator';

// Primero definimos el tipo para las claves
type FilterKeys = keyof FilterGeoPredioGeneralDto;

// Definimos el DTO
export class FilterGeoPredioGeneralDto {
	@IsOptional()
	@IsString()
	id?: string;

	@IsOptional()
	@IsString()
	claveCatastral?: string;

	@IsOptional()
	@IsString()
	claveCatastralAnterior?: string;

	@IsOptional()
	@IsString()
	tipoPredio?: string;

	@IsOptional()
	@IsString()
	uso?: string;

	@IsOptional()
	@IsString()
	agua?: string;

	@IsOptional()
	@IsString()
	sanitarias?: string;

	@IsOptional()
	@IsString()
	energia?: string;

	@IsOptional()
	@IsString()
	documentoPropietario?: string;

	@IsOptional()
	@IsString()
	propietario?: string;

	@IsOptional()
	@IsString()
	tipoPersona?: string;

	@IsOptional()
	@IsString()
	personeria?: string;

	@IsOptional()
	@IsNumber()
	area?: number;
}

// Función para verificar si una clave es válida
function isValidKey(key: string): key is FilterKeys {
	return [
		'id',
		'claveCatastral',
		'claveCatastralAnterior',
		'tipoPredio',
		'uso',
		'agua',
		'sanitarias',
		'energia',
		'documentoPropietario',
		'propietario',
		'tipoPersona',
		'personeria',
		'area',
	].includes(key);
}

// Función para asignar valor con el tipo correcto
function assignValue(key: FilterKeys, value: string | undefined): string | number | undefined {
	if (!value) return undefined;

	const trimmedValue = value.trim();

	// Manejar tipos especiales
	switch (key) {
		case 'area':
			return trimmedValue ? parseFloat(trimmedValue) : undefined;
		default:
			return trimmedValue;
	}
}

export function parseFilters(filter?: string): FilterGeoPredioGeneralDto | undefined {
	if (!filter) {
		return undefined;
	}

	// Quitar los corchetes y separar los filtros
	const cleanFilter = filter.replace(/[\[\]]/g, '');
	const filterPairs = cleanFilter.split(',').map((pair) => pair.split('='));

	// Convertir a objeto
	const filters = {} as FilterGeoPredioGeneralDto;

	for (const [key, value] of filterPairs) {
		const trimmedKey = key.trim();

		if (isValidKey(trimmedKey)) {
			const typedValue = assignValue(trimmedKey, value);
			if (typedValue !== undefined) {
				(filters[trimmedKey] as any) = typedValue;
			}
		}
	}

	return filters;
}
