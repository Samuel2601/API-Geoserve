import {Injectable, OnModuleInit} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

import {EmailService} from 'src/common/email/email.service';
import {NotificationsService} from 'src/socket.io/notifications.service';
import {apiResponse} from 'src/common/helpers/apiResponse';
import {Permission} from 'src/entity/Permission.entity';
import {User} from 'src/entity/User.entity';
import {CreatePermissionDto, UpdatePermissionDto} from './permiso.dto';
import {HttpAdapterHost} from '@nestjs/core';

@Injectable()
export class PermisoService implements OnModuleInit {
	constructor(
		@InjectRepository(Permission)
		private permissionRepository: Repository<Permission>,
		@InjectRepository(User)
		private userRepository: Repository<User>,
		private readonly emailService: EmailService,
		private readonly notific: NotificationsService,
		private readonly httpAdapterHost: HttpAdapterHost,
	) {}

	async onModuleInit() {
		await this.initializePermissions();
	}

	async initializePermissions() {
		const permissions = await this.permissionRepository.find();
		if (permissions.length === 0) {
			// Obtén el adaptador HTTP
			const httpAdapter = this.httpAdapterHost.httpAdapter;
			const app = httpAdapter.getInstance();

			// Accede a las rutas directamente usando app._router.stack
			const routes = app._router.stack
				.filter((layer) => layer.route) // Filtra las capas que son rutas
				.map((layer) => ({
					path: layer.route.path,
					methods: layer.route.methods,
				}));

			for (const route of routes) {
				const methods = Object.keys(route.methods);
				for (const method of methods) {
					const permission = this.permissionRepository.create({
						name: route.path,
						method: method.toLowerCase(),
						users: [], // Aquí puedes añadir usuarios si es necesario
						is_default: false,
					});
					{
					}
					try {
						await this.permissionRepository.save(permission);
						console.log(`Permiso guardado: ${permission.name} ${permission.method}`);
					} catch (error) {
						console.error(`Error al guardar el permiso: ${permission.name} ${permission.method}`, error);
					}
				}
			}

			console.log('Permisos inicializados.');
		} else {
			console.log('Ya existen permisos en la base de datos.');
		}
	}

	async findAllfilter(filterParams: any, relationArray: string[], page: number, limit: number): Promise<any> {
		try {
			/*const data = await this.permissionRepository.find({
				where: params,
				order: {created_at: 'DESC'},
				relations,
			});*/

			const queryBuilder = this.permissionRepository.createQueryBuilder('permission');

			// Añadir relaciones
			relationArray.forEach((relation) => {
				queryBuilder.leftJoinAndSelect(`permission.${relation}`, relation);
			});

			// Aplicar filtros
			for (const key in filterParams) {
				const value = filterParams[key];
				const condition = key.includes('.') ? `permission.${key}` : `permission.${key}`;
				queryBuilder.andWhere(`${condition} = :${key}`, {[key]: value});
			}

			// Paginación
			const [permissions, total] = await queryBuilder
				.skip((page - 1) * limit)
				.take(limit)
				.getManyAndCount();

			return apiResponse(200, 'Permisos obtenidos con éxito.', {permissions, total}, null);
		} catch (error) {
			console.error(error);
			return apiResponse(500, 'ERROR', null, error);
		}
	}

	async findById(id: string): Promise<any> {
		try {
			const permission = await this.permissionRepository.findOne({where: {id}, relations: ['users']});
			if (!permission) {
				return apiResponse(404, 'Permiso no encontrado.', null, null);
			}
			return apiResponse(200, null, permission, null);
		} catch (error) {
			console.error(error);
			return apiResponse(500, 'ERROR', null, error);
		}
	}

	async createPermiso(createPermisoDto: CreatePermissionDto): Promise<any> {
		const {name, method, users} = createPermisoDto;
		try {
			const existingPermission = await this.permissionRepository.findOne({where: {name}});
			if (existingPermission) {
				return apiResponse(400, 'Ya existe un permiso con ese nombre', null, null);
			}

			const newPermission = this.permissionRepository.create({name, method, users});
			await this.permissionRepository.save(newPermission);

			for (const userId of users) {
				const userData = await this.userRepository.findOne({
					where: {id: userId}, // Asegúrate de que 'id' sea el nombre correcto del campo en tu entidad
				});
				if (userData) {
					await this.emailService.sendNotification(userData.email, 'Nuevo permiso otorgado', 'src/emailTemplates/newPermissUser.html', {
						userName: `${userData.name} ${userData.last_name}`,
						permissionName: name,
						permissionMethod: method,
					});
				}
			}

			return apiResponse(200, 'Permiso creado con éxito.', newPermission, null);
		} catch (error) {
			console.error(error);
			return apiResponse(500, 'ERROR', null, error);
		}
	}

	async updateRole(id: string, data: UpdatePermissionDto): Promise<any> {
		try {
			const permission = await this.permissionRepository.findOne({where: {id}, relations: ['users']});
			if (!permission) {
				return apiResponse(404, 'Permiso no encontrado.', null, null);
			}

			const updatedPermission = await this.permissionRepository.save({...permission, ...data});
			return apiResponse(200, 'Permiso actualizado con éxito.', updatedPermission, null);
		} catch (error) {
			console.error(error);
			return apiResponse(500, 'ERROR', null, error);
		}
	}

	async deleteRole(id: string): Promise<any> {
		try {
			const result = await this.permissionRepository.delete(id);
			if (result.affected === 0) {
				return apiResponse(404, 'Permiso no encontrado.', null, null);
			}
			return apiResponse(200, 'Permiso eliminado con éxito.', null, null);
		} catch (error) {
			console.error(error);
			return apiResponse(500, 'ERROR', null, error);
		}
	}

	async createBatch(createPermissionDtos: CreatePermissionDto[]): Promise<any> {
		const createdPermissions: Permission[] = [];
		const errors = [];

		for (const dto of createPermissionDtos) {
			try {
				const permission = this.permissionRepository.create(dto);
				await this.permissionRepository.save(permission);
				createdPermissions.push(permission);
			} catch (error) {
				errors.push({user: dto, message: error.message});
			}
		}

		return apiResponse(
			errors.length > 0 ? 207 : 201,
			errors.length > 0 ? 'Hubieron algunos errores al crear los permisos.' : 'Creación de permisos exitosa.',
			createdPermissions,
			errors,
		);
	}

	async updateBatch(updatePermissionDtos: UpdatePermissionDto[]): Promise<any> {
		const updatedPermissions: Permission[] = [];
		const errors = [];

		for (const dto of updatePermissionDtos) {
			try {
				const permission = await this.permissionRepository.findOne({where: {id: dto.id}});
				if (!permission) {
					errors.push({id: dto.id, message: `Permiso con ID ${dto.id} no encontrado`});
					continue;
				}
				const updatedPermission = await this.permissionRepository.save({...permission, ...dto});
				updatedPermissions.push(updatedPermission);
			} catch (error) {
				errors.push({id: dto.id, message: error.message});
			}
		}

		return apiResponse(
			errors.length > 0 ? 207 : 200,
			errors.length > 0 ? 'Algunos permisos no pudieron ser actualizados.' : 'Actualización de permisos exitosa.',
			updatedPermissions,
			errors,
		);
	}
}
