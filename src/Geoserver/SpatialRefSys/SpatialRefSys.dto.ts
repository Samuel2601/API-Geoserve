import { IsOptional, IsString, IsNumber } from 'class-validator';

export class FilterSpatialRefSysDto {
  @IsOptional()
  @IsNumber()
  srid?: number;

  @IsOptional()
  @IsString()
  authName?: string;

  @IsOptional()
  @IsNumber()
  authSrid?: number;

  @IsOptional()
  @IsString()
  srtext?: string;

  @IsOptional()
  @IsString()
  proj4text?: string;
}

// Definimos el tipo para las claves de FilterSpatialRefSysDto
type FilterKeysSpatialRefSys = keyof FilterSpatialRefSysDto;

// Función para verificar si una clave es válida
function isValidKeySpatialRefSys(key: string): key is FilterKeysSpatialRefSys {
  return ['srid', 'authName', 'authSrid', 'srtext', 'proj4text'].includes(key);
}

// Función para asignar valor con el tipo correcto
function assignValueSpatialRefSys(key: FilterKeysSpatialRefSys, value: string | undefined): string | number | undefined {
  if (!value) return undefined;

  const trimmedValue = value.trim();

  switch (key) {
    case 'srid':
    case 'authSrid':
      return trimmedValue ? parseInt(trimmedValue, 10) : undefined;
    default:
      return trimmedValue;
  }
}

// Función para convertir los filtros de un string a un objeto `FilterSpatialRefSysDto`
export function parseFiltersSpatialRefSys(filter?: string): FilterSpatialRefSysDto | undefined {
  if (!filter) return undefined;

  const cleanFilter = filter.replace(/[\[\]]/g, '');
  const filterPairs = cleanFilter.split(',').map((pair) => pair.split('='));

  const filters = {} as FilterSpatialRefSysDto;

  for (const [key, value] of filterPairs) {
    const trimmedKey = key.trim();

    if (isValidKeySpatialRefSys(trimmedKey)) {
      const typedValue = assignValueSpatialRefSys(trimmedKey, value);
      if (typedValue !== undefined) {
        (filters[trimmedKey] as any) = typedValue;
      }
    }
  }

  return filters;
}
