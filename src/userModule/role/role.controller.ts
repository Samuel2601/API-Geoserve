import {Body, Query, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe, Injectable, UseGuards} from '@nestjs/common';

import * as Dto from './role.dto';
import {RoleService} from './role.service';
import {FindByIdDto} from 'src/common/dto/id.dto';
import {DynamicQueryValidationGuard} from 'src/common/guards/query-validation.guard';
import {Role} from 'src/entity/Role.entity';
import {Entity} from 'src/common/decorators/entity.decorator';

@Controller('/roles')
@Injectable()
export class RoleController {
	constructor(private readonly rolesService: RoleService) {}

	@Get()
	@UseGuards(DynamicQueryValidationGuard)
	@Entity(Role)
	async findAllFilterRelation(@Query('filter') filter: string, @Query('relations') relations: string): Promise<any> {
		const filterParams = filter ? JSON.parse(filter) : {};
		const relationArray = relations ? relations.split(',') : [];
		return await this.rolesService.findAllfilter(filterParams, relationArray);
	}

	@Get('/:id')
	@UsePipes(new ValidationPipe({transform: true}))
	async findById(@Param() params: FindByIdDto): Promise<any> {
		return await this.rolesService.findById(params);
	}

	@Post('')
	@UsePipes(new ValidationPipe({transform: true}))
	async create(@Body() rolDto: Dto.CreateRoleUserDto): Promise<any> {
		return await this.rolesService.createRole(rolDto);
	}

	@Put('/:id')
	@UsePipes(new ValidationPipe({transform: true}))
	async updateRole(@Param() params: FindByIdDto, @Body() rolDto: Dto.UpdateRoleUserDto): Promise<any> {
		return await this.rolesService.updateRole(params, rolDto);
	}

	@Delete('/:id')
	@UsePipes(new ValidationPipe({transform: true}))
	async deleteRole(@Param() params: FindByIdDto): Promise<any> {
		return await this.rolesService.deleteRole(params);
	}

	@Post('batch')
	@UsePipes(new ValidationPipe({transform: true}))
	async createBatch(@Body() rolDto: Dto.CreateRoleUserDto[]): Promise<any> {
		return await this.rolesService.createBatch(rolDto);
	}

	@Put('batch')
	@UsePipes(new ValidationPipe({transform: true}))
	async updateBatch(@Body() updateRoleUserDto: Dto.UpdateRoleUserDto[]): Promise<any> {
		return await this.rolesService.updateBatch(updateRoleUserDto);
	}
}
