import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn} from 'typeorm';
import {Institution} from './Institution.entity';

@Entity()
export class Access {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => Institution)
	@JoinColumn({name: 'id_instituto'})
	instituto: Institution;

	@Column({length: 200})
	url: string;

	@Column({length: 10})
	port: string;

	@Column({length: 100})
	db_name: string;

	@Column({length: 100})
	db_user: string;

	@Column({length: 100})
	db_password: string;

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
