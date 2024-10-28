import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany} from 'typeorm';
import {Role} from './Role.entity';

@Entity('permissions')
export class Permission {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({length: 50})
	name: string;

	@Column({length: 50})
	method: string;

	@Column('uuid', {array: true, default: () => 'ARRAY[]::uuid[]'})
	users: string[];

	@Column({default: false})
	is_default: boolean;

	@CreateDateColumn({
		name: 'created_at',
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP',
	})
	created_at: Date;

	@UpdateDateColumn({
		name: 'updated_at',
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP',
	})
	updated_at: Date;

	@ManyToMany(() => Role, (role) => role.permissions)
	roles: Role[];
}
