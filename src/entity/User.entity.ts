import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany, UpdateDateColumn} from 'typeorm'; // Relación con SocialNetwork
import {Role} from './Role.entity';
import {SocialNetwork} from './SocialNetwork.entity';

@Entity('users')
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({type: 'varchar', length: 100, nullable: false})
	name: string;

	@Column({type: 'varchar', length: 100, nullable: true})
	last_name: string;

	@Column({type: 'varchar', length: 20, unique: true, nullable: true})
	dni?: string;

	@Column({type: 'varchar', length: 15, nullable: true})
	phone: string;

	@Column({type: 'varchar', length: 100, unique: true, nullable: false})
	email: string;

	@Column({type: 'varchar', length: 255, nullable: true})
	password: string;

	@Column({type: 'boolean', default: false})
	verificado: boolean;

	@Column({type: 'boolean', default: true})
	status: boolean;

	// User.entity.ts
	@ManyToOne(() => Role, (role) => role.users, {nullable: false, eager: true})
	role: Role;

	@OneToMany(() => SocialNetwork, (socialNetwork) => socialNetwork.user, {cascade: true})
	redes: SocialNetwork[];

	@Column({type: 'text', nullable: true})
	photo: string;

	@Column({type: 'varchar', length: 255, nullable: true})
	verificationCode: string;

	@Column({type: 'varchar', length: 255, nullable: true})
	passwordTemp: string;

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
}
