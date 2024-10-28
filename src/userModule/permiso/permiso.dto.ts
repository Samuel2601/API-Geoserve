import {IsNotEmpty, IsBoolean, IsString, ArrayNotEmpty, IsArray, IsOptional, IsUUID, ValidateNested} from 'class-validator';
import {Type} from 'class-transformer';
class UsernDto {
	@IsUUID()
	id: string;
}
export class CreatePermissionDto {
	@IsNotEmpty()
	@IsString()
	name: string;

	@IsNotEmpty()
	@IsString()
	method: string;

	@IsOptional()
	@IsArray()
	@IsUUID('all', {each: true}) // Usando UUID como tipo de ID
	readonly users?: string[]; // Cambiado de Types.ObjectId[] a string[]

	@IsOptional()
	@IsBoolean()
	is_default?: boolean; // Añadido el signo de interrogación para hacerlo opcional
}

export class UpdatePermissionDto {
	@IsNotEmpty()
	@IsUUID() // Usando UUID como tipo de ID
	id: string;

	@IsOptional()
	@IsString()
	name?: string;

	@IsOptional()
	@IsString()
	method?: string;

	@IsOptional()
	@IsArray()
	@IsUUID('all', {each: true}) // Usando UUID como tipo de ID
	readonly users?: string[]; // Cambiado de Types.ObjectId[] a string[]

	@IsOptional()
	@IsBoolean()
	is_default?: boolean;
}
