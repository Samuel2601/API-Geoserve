import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TubWinchele } from 'src/entities/entities/TubWinchele';
import { Repository } from 'typeorm';

@Injectable()
export class TubWincheleService {
  constructor(
    @InjectRepository(TubWinchele)
    private readonly tubWincheleRepository: Repository<TubWinchele>,
  ) {}

  async findAll(): Promise<TubWinchele[]> {
    return this.tubWincheleRepository.find();
  }

  async findOne(id: number): Promise<TubWinchele> {
    const tubWinchele = await this.tubWincheleRepository.findOne({ where: { id } });
    if (!tubWinchele) {
      throw new NotFoundException(`TubWinchele con ID ${id} no encontrado`);
    }
    return tubWinchele;
  }

  async create(tubWinchele: TubWinchele): Promise<TubWinchele> {
    const newTubWinchele = this.tubWincheleRepository.create(tubWinchele);
    return this.tubWincheleRepository.save(newTubWinchele);
  }

  async update(id: number, tubWinchele: TubWinchele): Promise<TubWinchele> {
    await this.findOne(id); // Verifica si el ID existe
    await this.tubWincheleRepository.update(id, tubWinchele);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const tubWinchele = await this.findOne(id); // Verifica si el ID existe
    await this.tubWincheleRepository.remove(tubWinchele);
  }
}
