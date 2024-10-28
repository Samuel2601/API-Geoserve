import {IsNotEmpty, IsString, IsBoolean, IsOptional, IsArray, IsInt, IsUUID, ValidateNested} from 'class-validator';
import {Type} from 'class-transformer';
class PermissionDto {
	@IsUUID()
	id: string;
}

export class CreateRoleUserDto {
	@IsNotEmpty()
	@IsString()
	readonly name: string;

	@IsOptional()
	@IsString()
	readonly access_scope?: string;

	@IsOptional()
	@IsArray()
	@ValidateNested({each: true})
	@Type(() => PermissionDto)
	readonly permisos?: PermissionDto[];

	@IsOptional()
	@IsBoolean()
	readonly is_default?: boolean; // Se puede definir si es rol por defecto o no
}

export class UpdateRoleUserDto {
	@IsNotEmpty() // Asegurarse que este campo esté presente
	@IsUUID()
	readonly id: string; // Cambiado a number para ID

	@IsOptional()
	@IsString()
	readonly name?: string;

	@IsOptional()
	@IsString()
	readonly access_scope?: string;

	@IsOptional()
	@IsArray()
	@ValidateNested({each: true})
	@Type(() => PermissionDto)
	readonly permisos?: PermissionDto[];

	@IsOptional()
	@IsBoolean()
	readonly is_default?: boolean; // Actualización opcional de rol por defecto
}
