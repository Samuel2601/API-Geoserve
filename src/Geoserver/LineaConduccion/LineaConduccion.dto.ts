import { IsOptional, IsString, IsNumber } from 'class-validator';

export class FilterLineaConduccionDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsOptional()
  @IsString()
  fid?: string;

  @IsOptional()
  @IsString()
  diMetro?: string;

  @IsOptional()
  @IsString()
  descripci?: string;

  @IsOptional()
  @IsNumber()
  long?: number;
}

// Definimos el tipo para las claves de FilterLineaConduccionDto
type FilterKeysLineaConduccion = keyof FilterLineaConduccionDto;

// Función para verificar si una clave es válida
function isValidKeyLineaConduccion(key: string): key is FilterKeysLineaConduccion {
  return ['id', 'fid', 'diMetro', 'descripci', 'long'].includes(key);
}

// Función para asignar valor con el tipo correcto
function assignValueLineaConduccion(key: FilterKeysLineaConduccion, value: string | undefined): string | number | undefined {
  if (!value) return undefined;

  const trimmedValue = value.trim();

  switch (key) {
    case 'id':
      return trimmedValue ? parseInt(trimmedValue, 10) : undefined;
    case 'long':
      return trimmedValue ? parseFloat(trimmedValue) : undefined;
    default:
      return trimmedValue;
  }
}

// Función para convertir los filtros de un string a un objeto `FilterLineaConduccionDto`
export function parseFiltersLineaConduccion(filter?: string): FilterLineaConduccionDto | undefined {
  if (!filter) return undefined;

  const cleanFilter = filter.replace(/[\[\]]/g, '');
  const filterPairs = cleanFilter.split(',').map((pair) => pair.split('='));

  const filters = {} as FilterLineaConduccionDto;

  for (const [key, value] of filterPairs) {
    const trimmedKey = key.trim();

    if (isValidKeyLineaConduccion(trimmedKey)) {
      const typedValue = assignValueLineaConduccion(trimmedKey, value);
      if (typedValue !== undefined) {
        (filters[trimmedKey] as any) = typedValue;
      }
    }
  }

  return filters;
}
