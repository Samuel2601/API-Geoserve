import {Injectable, OnModuleInit} from '@nestjs/common';
import {apiResponse} from 'src/common/helpers/apiResponse';
import {NotificationsService} from 'src/socket.io/notifications.service';
import {CreateRoleUserDto, UpdateRoleUserDto} from './role.dto';
import {PermisoService} from '../permiso/permiso.service';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Role} from 'src/entity/Role.entity';
import {User} from 'src/entity/User.entity';
import {Permission} from 'src/entity/Permission.entity';
import {FindByIdDto} from 'src/common/dto/id.dto';

@Injectable()
export class RoleService implements OnModuleInit {
	constructor(
		@InjectRepository(Role) private roleRepository: Repository<Role>,
		@InjectRepository(User) private userRepository: Repository<User>,
		@InjectRepository(Permission) private permissRepository: Repository<Permission>,
		private notific: NotificationsService,
		private permisoService: PermisoService,
	) {}

	async onModuleInit() {
		await this.initializeRoles();
	}

	private async initializeRoles() {
		const existingRoles = await this.roleRepository.find();
		const existingPermissions = await this.permissRepository.find();

		// Verificar si no hay permisos y crearlos si es necesario
		if (existingPermissions.length === 0) {
			await this.permisoService.initializePermissions();
		}

		// Verificar si no hay roles y crearlos si es necesario
		if (existingRoles.length === 0) {
			// Crear y guardar el rol de administrador
			const adminRole = this.roleRepository.create({
				name: 'admin',
				permissions: existingPermissions, // Aquí asignamos directamente los permisos
				is_default: true,
				access_scope: 'all',
			});

			await this.roleRepository.save(adminRole);
			console.log('Rol de administrador creado.');
		} else {
			console.log('Ya existen roles en la base de datos.');
		}
	}

	/**
	 * Devuelve una lista de todos los usuarios en la base de datos.
	 * @returns Promesa que resuelve con una lista de usuarios.
	 */
	async findAllfilter(params: any, relations: string[] = []): Promise<any> {
		try {
			const data = await this.roleRepository.find({
				where: params,
				order: {created_at: 'DESC'},
				relations,
			});
			return apiResponse(200, 'Roles obtenidos con éxito.', data, null);
		} catch (error) {
			console.error(error);
			return apiResponse(500, 'ERROR', null, error);
		}
	}

	async findById(param: FindByIdDto): Promise<any> {
		try {
			const role = await this.roleRepository.findOne({
				where: {id: param.id},
				relations: ['permisos'], // Relacionar permisos
			});

			if (!role) {
				return apiResponse(404, 'Rol no encontrado.', null, null);
			}

			return apiResponse(200, null, role, null);
		} catch (error) {
			console.error(error);
			return apiResponse(500, 'ERROR', null, error);
		}
	}

	async createRole(createRoleDto: CreateRoleUserDto): Promise<any> {
		const {name, permisos, is_default} = createRoleDto;

		// Verifica si ya existe un rol con el mismo nombre
		const existingRole = await this.roleRepository.findOne({where: {name}});
		if (existingRole) {
			return apiResponse(400, 'Ya existe un rol con ese nombre', null, null);
		}

		const assignedPermissions = permisos.length > 0 ? permisos : await this.permissRepository.find({where: {is_default: true}});

		// Crear nuevo rol con los permisos asignados
		const newRole = this.roleRepository.create({
			name,
			permissions: assignedPermissions,
			is_default,
		});

		await this.roleRepository.save(newRole);
		return apiResponse(201, 'Rol creado con éxito.', newRole, null);
	}

	async updateRole(param: FindByIdDto, data: UpdateRoleUserDto): Promise<any> {
		try {
			const role = await this.roleRepository.findOne({
				where: {id: param.id},
				relations: ['permissions'],
			});

			if (!role) {
				return apiResponse(404, 'Rol no encontrado.', null, null);
			}

			// Actualiza el rol con los nuevos datos
			await this.roleRepository.update(param.id, data);

			// Notificar cambios de permisos
			const updatedRole = await this.roleRepository.findOne({
				where: {id: param.id},
				relations: ['permisos'],
			});

			if (updatedRole) {
				// Comparar permisos eliminados/agregados
				const removedPermissions = role.permissions.filter((permiso) => !updatedRole.permissions.includes(permiso));
				const addedPermissions = updatedRole.permissions.filter((permiso) => !role.permissions.includes(permiso));

				const users = await this.userRepository.find({where: {role: param}});
				users.forEach((user) => {
					removedPermissions.forEach((permiso) => {
						this.notific.notifyPermissionChange(user.id, 'PERMISSION_REMOVED', permiso.id);
					});
					addedPermissions.forEach((permiso) => {
						this.notific.notifyPermissionChange(user.id, 'PERMISSION_ADDED', permiso.id);
					});
				});
			}

			return apiResponse(200, 'Rol actualizado con éxito.', updatedRole, null);
		} catch (error) {
			console.error(error);
			return apiResponse(500, 'ERROR', null, error);
		}
	}

	async deleteRole(param: FindByIdDto): Promise<any> {
		try {
			const role = await this.roleRepository.findOne({where: {id: param.id}});
			if (!role) {
				return apiResponse(404, 'Rol no encontrado.', null, null);
			}

			await this.roleRepository.remove(role);
			return apiResponse(200, 'Rol eliminado con éxito.', null, null);
		} catch (error) {
			console.error(error);
			return apiResponse(500, 'ERROR', null, error);
		}
	}

	async createBatch(CreateRoleUserDto: CreateRoleUserDto[]): Promise<any> {
		const createdRoles = [];
		const errors = [];

		for (const roleDto of CreateRoleUserDto) {
			try {
				const createdRole = this.roleRepository.create(roleDto);
				await this.roleRepository.save(createdRole);
				createdRoles.push(createdRole);
			} catch (error) {
				errors.push({
					role: roleDto,
					message: error.message,
				});
			}
		}

		return apiResponse(errors.length > 0 ? 207 : 201, errors.length > 0 ? 'Hubieron algunos errores al crear los roles.' : 'Creación de roles exitosa.', createdRoles, errors);
	}

	async updateBatch(updateUsersDto: UpdateRoleUserDto[]): Promise<any> {
		const updatedRoles = [];
		const errors = [];

		for (const dtoRole of updateUsersDto) {
			try {
				const role = await this.roleRepository.findOne({where: {id: dtoRole.id}});
				if (!role) {
					errors.push({
						id: dtoRole.id,
						message: `Rol con ID ${dtoRole.id} no encontrado`,
					});
					continue;
				}

				await this.roleRepository.update(dtoRole.id, dtoRole);
				const updatedRole = await this.roleRepository.findOne({where: {id: dtoRole.id}});
				updatedRoles.push(updatedRole);
			} catch (error) {
				errors.push({
					id: dtoRole.id,
					message: error.message,
				});
			}
		}

		return apiResponse(errors.length > 0 ? 207 : 200, errors.length > 0 ? 'Algunos roles no pudieron ser actualizados.' : 'Actualización de roles exitosa.', updatedRoles, errors);
	}

	async getDefaultRole(): Promise<Role | null> {
		try {
			const defaultRole = await this.roleRepository.findOne({where: {is_default: true}});
			return defaultRole || null;
		} catch (error) {
			console.error(error);
			return null;
		}
	}
}
