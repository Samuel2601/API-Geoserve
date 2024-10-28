import { IsUUID } from 'class-validator';

export class FindByIdDto {
  @IsUUID('4', { message: 'Invalid UUID format' }) // Verifica si el UUID es de versión 4
  id: string;
}