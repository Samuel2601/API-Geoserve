import {Body, Query, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe, UseInterceptors, UploadedFile, UseGuards} from '@nestjs/common';
import {UserService} from './user.service';
import {CreateUserDto, UpdateUserDto} from './user.dto';
import {FindByIdDto} from 'src/common/dto/id.dto';
import {FileInterceptor} from '@nestjs/platform-express';
import {UploadsService} from 'src/common/uploads/uploads.service';
import {DynamicQueryValidationGuard} from 'src/common/guards/query-validation.guard';
import {User} from 'src/entity/User.entity';
import {Entity} from 'src/common/decorators/entity.decorator';

@Controller('/users')
export class UserController {
	constructor(private readonly usersService: UserService) {}

	// Obtener todos los usuarios (GET /users)
	//@UseGuards(DynamicQueryValidationGuard)
	//@Entity(User)
	@Get()
	async getAllUsers(
		@Query('filter') filter: any, // Recibimos el filtro de la consulta
		@Query('page') page = 1,
		@Query('limit') limit = 10,
	) {
		// Convertimos el filtro en el formato esperado por el servicio
		const filterParams = this.formatFilterParams(filter);

		// Configuramos los parámetros de paginación
		const paginationParams = {page: Number(page), limit: Number(limit)};

		// Definimos las opciones de consulta
		const queryOptions = {
			relations: ['role',], // Ajusta según tus relaciones
			select: ['id', 'name', 'last_name', 'email'] as (keyof User)[], // Ajusta según tus campos
			//order: {created_at: 'DESC'} as {[key: string]: 'ASC' | 'DESC'}, // Ajusta según tus campos
		};

		// Llamamos al servicio genérico
		return this.usersService.getAllFiltered(filterParams, paginationParams, queryOptions);
	}

	private formatFilterParams(filter: any): any {
		const formattedFilters: any = {};

		for (const key in filter) {
			const operator = filter[key]['operator'];
			const value = filter[key]['value'];

			// Aquí se puede añadir lógica para manejar diferentes tipos de datos
			formattedFilters[key] = {
				operator,
				value: Array.isArray(value) ? value : [value], // Aseguramos que el valor sea un array
			};
		}

		return formattedFilters;
	}

	// Obtener un usuario por su ID (GET /users/:id)
	@Get('/:id')
	@UsePipes(new ValidationPipe({transform: true}))
	async findById(@Param() params: FindByIdDto): Promise<any> {
		return await this.usersService.findById(params.id);
	}

	// Crear un nuevo usuario (POST /users)
	@Post()
	@UsePipes(new ValidationPipe({transform: true}))
	@UseInterceptors(FileInterceptor('photo', UploadsService.configureMulter(5 * 1024 * 1024, 'users'))) //uso del fileinterceptor para subir el archivo
	async createUser(@Body() userDto: CreateUserDto, @UploadedFile() file: Express.Multer.File): Promise<any> {
		if (file) {
			userDto.photo = file.filename;
		}
		return await this.usersService.createUser(userDto);
	}

	// Actualizar un usuario (PUT /users/:id)
	@Put('/:id')
	@UsePipes(new ValidationPipe({transform: true}))
	async updateUser(@Param() params: FindByIdDto, @Body() updateUserDto: UpdateUserDto): Promise<any> {
		return await this.usersService.updateUser(params.id, updateUserDto);
	}

	// Eliminar un usuario (DELETE /users/:id)
	@Delete('/:id')
	@UsePipes(new ValidationPipe({transform: true}))
	async deleteUser(@Param() params: FindByIdDto): Promise<any> {
		return await this.usersService.deleteUser(params.id);
	}

	@Post('batch')
	@UsePipes(new ValidationPipe({transform: true}))
	async createBatch(@Body() createUsersDto: CreateUserDto[]): Promise<any> {
		return await this.usersService.createBatch(createUsersDto);
	}

	@Put('batch')
	@UsePipes(new ValidationPipe({transform: true}))
	async updateBatch(@Body() updateUsersDto: UpdateUserDto[]): Promise<any> {
		return await this.usersService.updateBatch(updateUsersDto);
	}
}
