import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LineaConducciN } from 'src/entities/entities/LineaConducciN';
import { Repository } from 'typeorm';

@Injectable()
export class LineaConduccionService {
  constructor(
    @InjectRepository(LineaConducciN)
    private readonly lineaConduccionRepository: Repository<LineaConducciN>,
  ) {}

  async findAll(): Promise<LineaConducciN[]> {
    return this.lineaConduccionRepository.find();
  }

  async findOne(id: number): Promise<LineaConducciN> {
    const linea = await this.lineaConduccionRepository.findOne({ where: { id } });
    if (!linea) {
      throw new NotFoundException(`Linea con id ${id} no encontrada`);
    }
    return linea;
  }

  async create(lineaConduccion: LineaConducciN): Promise<LineaConducciN> {
    const newLineaConduccion = this.lineaConduccionRepository.create(lineaConduccion);
    return this.lineaConduccionRepository.save(newLineaConduccion);
  }

  async update(id: number, lineaConduccion: LineaConducciN): Promise<LineaConducciN> {
    await this.findOne(id); // Verifica si la línea existe
    await this.lineaConduccionRepository.update(id, lineaConduccion);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const linea = await this.findOne(id); // Verifica si la línea existe
    await this.lineaConduccionRepository.remove(linea);
  }
}
