import { IsOptional, IsString, IsNumber } from 'class-validator';

export class FilterAreaTanquesDto {
  @IsOptional()
  @IsString()
  nomTanque?: string;

  @IsOptional()
  @IsString()
  orden?: string;

  @IsOptional()
  @IsString()
  sector?: string;

  @IsOptional()
  @IsString()
  capacidad?: string;

  @IsOptional()
  @IsString()
  numero?: string;

  @IsOptional()
  @IsNumber()
  id?: number;
}

// Definimos el tipo para las claves de FilterAreaTanquesDto
type FilterKeysAreaTanques = keyof FilterAreaTanquesDto;

// Función para verificar si una clave es válida
function isValidKeyAreaTanques(key: string): key is FilterKeysAreaTanques {
  return ['nomTanque', 'orden', 'sector', 'capacidad', 'numero', 'id'].includes(key);
}

// Función para asignar valor con el tipo correcto
function assignValueAreaTanques(key: FilterKeysAreaTanques, value: string | undefined): string | number | undefined {
  if (!value) return undefined;

  const trimmedValue = value.trim();

  switch (key) {
    case 'id':
      return trimmedValue ? parseInt(trimmedValue, 10) : undefined;
    default:
      return trimmedValue;
  }
}

// Función para convertir los filtros de un string a un objeto `FilterAreaTanquesDto`
export function parseFiltersAreaTanques(filter?: string): FilterAreaTanquesDto | undefined {
  if (!filter) return undefined;

  const cleanFilter = filter.replace(/[\[\]]/g, '');
  const filterPairs = cleanFilter.split(',').map((pair) => pair.split('='));

  const filters = {} as FilterAreaTanquesDto;

  for (const [key, value] of filterPairs) {
    const trimmedKey = key.trim();

    if (isValidKeyAreaTanques(trimmedKey)) {
      const typedValue = assignValueAreaTanques(trimmedKey, value);
      if (typedValue !== undefined) {
        (filters[trimmedKey] as any) = typedValue;
      }
    }
  }

  return filters;
}
