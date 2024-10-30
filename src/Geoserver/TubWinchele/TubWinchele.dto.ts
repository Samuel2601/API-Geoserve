import {IsOptional, IsString, IsNumber} from 'class-validator';

export class FilterTubWincheleDto {
	@IsOptional()
	@IsNumber()
	id?: number;

	@IsOptional()
	@IsString()
	geom?: string;

	@IsOptional()
	@IsString()
	fid?: string;

	@IsOptional()
	@IsString()
	entity?: string;

	@IsOptional()
	@IsString()
	layer?: string;

	@IsOptional()
	@IsNumber()
	color?: number;

	@IsOptional()
	@IsString()
	linetype?: string;

	@IsOptional()
	@IsNumber()
	elevation?: number;

	@IsOptional()
	@IsNumber()
	linewt?: number;

	@IsOptional()
	@IsString()
	refname?: string;

	@IsOptional()
	@IsString()
	nivel?: string;

	@IsOptional()
	@IsString()
	e22?: string;

	@IsOptional()
	@IsString()
	diametro?: string;

	@IsOptional()
	@IsString()
	tanque?: string;

	@IsOptional()
	@IsString()
	canton?: string;
}
// Definimos el tipo para las claves de FilterTubWincheleDto
type FilterKeysTubWinchele = keyof FilterTubWincheleDto;

// Función para verificar si una clave es válida
function isValidKeyTubWinchele(key: string): key is FilterKeysTubWinchele {
	return ['id', 'geom', 'fid', 'entity', 'layer', 'color', 'linetype', 'elevation', 'linewt', 'refname', 'nivel', 'e22', 'diametro', 'tanque', 'canton'].includes(key);
}

// Función para asignar valor con el tipo correcto
function assignValueTubWinchele(key: FilterKeysTubWinchele, value: string | undefined): string | number | undefined {
	if (!value) return undefined;

	const trimmedValue = value.trim();

	switch (key) {
		case 'id':
		case 'color':
		case 'linewt':
		case 'nivel':
			return trimmedValue ? parseInt(trimmedValue, 10) : undefined;
		case 'elevation':
			return trimmedValue ? parseFloat(trimmedValue) : undefined;
		default:
			return trimmedValue;
	}
}

// Función para convertir los filtros de un string a un objeto `FilterTubWincheleDto`
export function parseFiltersTubWinchele(filter?: string): FilterTubWincheleDto | undefined {
	if (!filter) return undefined;

	const cleanFilter = filter.replace(/[\[\]]/g, '');
	const filterPairs = cleanFilter.split(',').map((pair) => pair.split('='));

	const filters = {} as FilterTubWincheleDto;

	for (const [key, value] of filterPairs) {
		const trimmedKey = key.trim();

		if (isValidKeyTubWinchele(trimmedKey)) {
			const typedValue = assignValueTubWinchele(trimmedKey, value);
			if (typedValue !== undefined) {
				(filters[trimmedKey] as any) = typedValue;
			}
		}
	}

	return filters;
}
