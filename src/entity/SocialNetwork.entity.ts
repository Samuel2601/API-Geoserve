import {Entity, Column, PrimaryGeneratedColumn, ManyToOne} from 'typeorm';
import {User} from './User.entity';

@Entity('social_networks')
export class SocialNetwork {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({type: 'varchar', length: 50, nullable: false})
	provider: string;

	@Column({type: 'varchar', length: 100, nullable: false})
	providerId: string;

	@Column({type: 'varchar', length: 255, nullable: true})
	profileUrl: string;

	@ManyToOne(() => User, (user) => user.redes, {onDelete: 'CASCADE'})
	user: User;
}
