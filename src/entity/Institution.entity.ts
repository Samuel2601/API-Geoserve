import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn} from 'typeorm';
import {User} from './User.entity';

@Entity()
export class Institution {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({length: 100})
	name: string;

	@Column({length: 200})
	address: string;

	@Column({length: 15})
	phone: string;

	@ManyToOne(() => User)
	@JoinColumn({name: 'id_user'})
	user: User;

	@Column({type: 'boolean', default: true})
	status: boolean;

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
