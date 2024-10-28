/* eslint-disable @typescript-eslint/no-unsafe-function-type */
// Decorador personalizado para especificar la entidad
import {SetMetadata} from '@nestjs/common';

export const Entity = (entity: Function) => SetMetadata('entity', entity);
