import {IsString, IsNotEmpty, IsEmail, IsOptional, IsBoolean, IsUUID, MinLength, ValidateNested} from 'class-validator';
import {Role} from 'src/entity/Role.entity';
import {Type} from 'class-transformer';

/**
 * DTO para crear un nuevo usuario en PostgreSQL.
 */
export class CreateUserDto {
	/**
	 * Nombre del usuario.
	 */
	@IsString()
	@IsNotEmpty()
	name: string;

	/**
	 * Apellido del usuario (opcional).
	 */
	@IsString()
	@IsOptional()
	last_name?: string;

	/**
	 * DNI del usuario (opcional).
	 */
	@IsString()
	@IsOptional()
	dni?: string;

	/**
	 * Teléfono del usuario (opcional).
	 */
	@IsString()
	@IsOptional()
	phone?: string;

	/**
	 * Correo electrónico del usuario.
	 */
	@IsEmail()
	@IsNotEmpty()
	email: string;

	/**
	 * Contraseña del usuario (opcional).
	 */
	@IsString()
	@IsOptional()
	@MinLength(6)
	password?: string;

	/**
	 * Indicador de si el usuario está verificado.
	 */
	@IsBoolean()
	@IsOptional()
	verificado?: boolean;

	/**
	 * Estado del usuario (activo o inactivo).
	 */
	@IsBoolean()
	@IsOptional()
	status?: boolean;

	/**
	 * Rol del usuario (referencia al objeto rol).
	 */
	@ValidateNested() // Para validar que sea un objeto
	@Type(() => Role) // Asegúrate de importar y usar el tipo correcto
	@IsOptional()
	role?: Role;

	/**
	 * URL de la foto del usuario (opcional).
	 */
	@IsString()
	@IsOptional()
	photo?: string;

	/**
	 * Redes sociales del usuario (opcional).
	 */
	@IsOptional()
	redes?: {
		provider: string; // Ejemplo: 'google', 'facebook', 'github'
		providerId: string; // ID del usuario en el proveedor
		profileUrl?: string; // URL de perfil del usuario en esa red social
	}[];
}

/**
 * DTO para actualizar un usuario existente en PostgreSQL.
 */
export class UpdateUserDto {
	/**
	 * UUID del usuario.
	 */
	@IsUUID()
	id: string;

	/**
	 * Nombre del usuario (opcional).
	 */
	@IsString()
	@IsOptional()
	name?: string;

	/**
	 * Apellido del usuario (opcional).
	 */
	@IsString()
	@IsOptional()
	last_name?: string;

	/**
	 * DNI del usuario (opcional).
	 */
	@IsString()
	@IsOptional()
	dni?: string;

	/**
	 * Teléfono del usuario (opcional).
	 */
	@IsString()
	@IsOptional()
	phone?: string;

	/**
	 * Correo electrónico del usuario (opcional).
	 */
	@IsEmail()
	@IsOptional()
	email?: string;

	/**
	 * Contraseña del usuario, con al menos 6 caracteres (opcional).
	 */
	@IsString()
	@IsOptional()
	@MinLength(6)
	password?: string;

	/**
	 * Indicador de si el usuario está verificado.
	 */
	@IsBoolean()
	@IsOptional()
	verificado?: boolean;

	/**
	 * Estado del usuario (activo o inactivo).
	 */
	@IsBoolean()
	@IsOptional()
	status?: boolean;

	/**
	 * Rol del usuario (referencia al objeto rol).
	 */
	@ValidateNested() // Para validar que sea un objeto
	@Type(() => Role) // Asegúrate de importar y usar el tipo correcto
	@IsOptional()
	role?: Role;

	/**
	 * URL de la foto del usuario (opcional).
	 */
	@IsString()
	@IsOptional()
	photo?: string;

	/**
	 * Redes sociales del usuario (opcional).
	 */
	@IsOptional()
	redes?: {
		provider: string; // Ejemplo: 'google', 'facebook', 'github'
		providerId: string; // ID del usuario en el proveedor
		profileUrl?: string; // URL de perfil del usuario en esa red social
	}[];
}
