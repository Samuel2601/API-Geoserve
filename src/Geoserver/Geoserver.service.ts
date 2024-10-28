import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {UbiTanques} from 'src/entities/entities/UbiTanques';
import {Repository} from 'typeorm';

@Injectable()
export class GeoserverService {
	constructor(
		@InjectRepository(UbiTanques)
		private ubiTanquesRepository: Repository<UbiTanques>,
	) {}

	async findAll(): Promise<UbiTanques[]> {
		return await this.ubiTanquesRepository.find();
	}

	async findOne(id: number): Promise<UbiTanques | undefined> {
		return await this.ubiTanquesRepository.findOne({where: {id}});
	}
}
