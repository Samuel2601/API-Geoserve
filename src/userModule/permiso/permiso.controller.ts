import {Body, Query, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe, UseGuards} from '@nestjs/common';

import * as Dto from './permiso.dto';
import {PermisoService} from './permiso.service';
import {FindByIdDto} from 'src/common/dto/id.dto';
import {DynamicQueryValidationGuard} from 'src/common/guards/query-validation.guard';

import {Permission} from 'src/entity/Permission.entity';
import {Entity} from 'src/common/decorators/entity.decorator';

@Controller('/permisos')
export class PermisoController {
	constructor(private readonly permissionService: PermisoService) {}

	// Inicializa los permisos en la base de datos
	@Get('init')
	async initializePermissions() {
		return await this.permissionService.onModuleInit();
	}

	// Obtener todos los permisos con opción de filtrado
	@Get()
	@UseGuards(DynamicQueryValidationGuard)
	@Entity(Permission)
	async findAllFilterRelation(@Query('filter') filter: string, @Query('relations') relations: string, @Query('page') page: number, @Query('limit') limit: number): Promise<any> {
		const filterParams = filter ? JSON.parse(filter) : {};
		const relationArray = relations ? relations.split(',') : [];
		return await this.permissionService.findAllfilter(filterParams, relationArray, page, limit);
	}

	// Obtener un permiso por su ID
	@Get(':id')
	@UsePipes(new ValidationPipe({transform: true}))
	async findById(@Param() params: FindByIdDto): Promise<any> {
		return await this.permissionService.findById(params.id);
	}

	// Crear un nuevo permiso
	@Post()
	@UsePipes(new ValidationPipe({transform: true}))
	async createPermission(@Body() createPermissionDto: Dto.CreatePermissionDto): Promise<any> {
		return await this.permissionService.createPermiso(createPermissionDto);
	}

	// Actualizar un permiso existente
	@Put('/:id')
	@UsePipes(new ValidationPipe({transform: true}))
	async updatePermission(@Param() params: FindByIdDto, @Body() updatePermissionDto: Dto.UpdatePermissionDto): Promise<any> {
		return await this.permissionService.updateRole(params.id, updatePermissionDto);
	}

	// Eliminar un permiso por su ID
	@Delete(':id')
	@UsePipes(new ValidationPipe({transform: true}))
	async deletePermission(@Param() params: FindByIdDto): Promise<any> {
		return await this.permissionService.deleteRole(params.id);
	}

	// Crear permisos en lote
	@Post('batch')
	@UsePipes(new ValidationPipe({transform: true}))
	async createBatchPermissions(@Body() createPermissionsDto: Dto.CreatePermissionDto[]): Promise<any> {
		return await this.permissionService.createBatch(createPermissionsDto);
	}

	// Actualizar permisos en lote
	@Put('batch')
	@UsePipes(new ValidationPipe({transform: true}))
	async updateBatchPermissions(@Body() updatePermissionsDto: Dto.UpdatePermissionDto[]): Promise<any> {
		return await this.permissionService.updateBatch(updatePermissionsDto);
	}
}
