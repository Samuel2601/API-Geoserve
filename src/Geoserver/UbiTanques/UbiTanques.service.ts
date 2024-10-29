import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UbiTanques } from 'src/entities/entities/UbiTanques';
import { Repository } from 'typeorm';

@Injectable()
export class UbiTanquesService {
  constructor(
    @InjectRepository(UbiTanques)
    private readonly ubiTanquesRepository: Repository<UbiTanques>,
  ) {}

  async findAll(): Promise<UbiTanques[]> {
    return this.ubiTanquesRepository.find();
  }

  async findOne(id: number): Promise<UbiTanques> {
    const ubiTanques = await this.ubiTanquesRepository.findOne({ where: { id } });
    if (!ubiTanques) {
      throw new NotFoundException(`UbiTanques con ID ${id} no encontrado`);
    }
    return ubiTanques;
  }

  async create(ubiTanques: UbiTanques): Promise<UbiTanques> {
    const newUbiTanques = this.ubiTanquesRepository.create(ubiTanques);
    return this.ubiTanquesRepository.save(newUbiTanques);
  }

  async update(id: number, ubiTanques: UbiTanques): Promise<UbiTanques> {
    await this.findOne(id); // Verifica si el ID existe
    await this.ubiTanquesRepository.update(id, ubiTanques);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const ubiTanques = await this.findOne(id); // Verifica si el ID existe
    await this.ubiTanquesRepository.remove(ubiTanques);
  }
}
