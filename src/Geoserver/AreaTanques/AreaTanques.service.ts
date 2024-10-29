import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import { AreaTanques } from 'src/entities/entities/AreaTanques';
import {Repository} from 'typeorm';

@Injectable()
export class AreaTanquesService {
	constructor(
		@InjectRepository(AreaTanques)
		private readonly areaTanquesRepository: Repository<AreaTanques>,
	) {}

	async findAll(): Promise<AreaTanques[]> {
		return this.areaTanquesRepository.find();
	}

	async findOne(id: number): Promise<AreaTanques> {
		const tanque = await this.areaTanquesRepository.findOne({where: {id}});
		if (!tanque) {
			throw new NotFoundException(`Tanque con id ${id} no encontrado`);
		}
		return tanque;
	}

	async create(areaTanques: AreaTanques): Promise<AreaTanques> {
		const newAreaTanques = this.areaTanquesRepository.create(areaTanques);
		return this.areaTanquesRepository.save(newAreaTanques);
	}

	async update(id: number, areaTanques: AreaTanques): Promise<AreaTanques> {
		await this.findOne(id); // Verifica si el tanque existe
		await this.areaTanquesRepository.update(id, areaTanques);
		return this.findOne(id);
	}

	async remove(id: number): Promise<void> {
		const tanque = await this.findOne(id); // Verifica si el tanque existe
		await this.areaTanquesRepository.remove(tanque);
	}
}
