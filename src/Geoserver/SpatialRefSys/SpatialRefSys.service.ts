import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SpatialRefSys } from 'src/entities/entities/SpatialRefSys';
import { Repository } from 'typeorm';

@Injectable()
export class SpatialRefSysService {
  constructor(
    @InjectRepository(SpatialRefSys)
    private readonly spatialRefSysRepository: Repository<SpatialRefSys>,
  ) {}

  async findAll(): Promise<SpatialRefSys[]> {
    return this.spatialRefSysRepository.find();
  }

  async findOne(srid: number): Promise<SpatialRefSys> {
    const spatialRefSys = await this.spatialRefSysRepository.findOne({ where: { srid } });
    if (!spatialRefSys) {
      throw new NotFoundException(`Sistema de referencia con SRID ${srid} no encontrado`);
    }
    return spatialRefSys;
  }

  async create(spatialRefSys: SpatialRefSys): Promise<SpatialRefSys> {
    const newSpatialRefSys = this.spatialRefSysRepository.create(spatialRefSys);
    return this.spatialRefSysRepository.save(newSpatialRefSys);
  }

  async update(srid: number, spatialRefSys: SpatialRefSys): Promise<SpatialRefSys> {
    await this.findOne(srid); // Verifica si el SRID existe
    await this.spatialRefSysRepository.update(srid, spatialRefSys);
    return this.findOne(srid);
  }

  async remove(srid: number): Promise<void> {
    const spatialRefSys = await this.findOne(srid); // Verifica si el SRID existe
    await this.spatialRefSysRepository.remove(spatialRefSys);
  }
}
