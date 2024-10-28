import { Column, Entity, Index } from "typeorm";

@Index("AREA_TANQUES_pkey", ["id"], { unique: true })
@Entity("AREA_TANQUES", { schema: "public" })
export class AreaTanques {
  @Column("integer", { primary: true, name: "id" })
  id: number;

  @Column("geometry", { name: "geom", nullable: true })
  geom: string | null;

  @Column("character varying", {
    name: "nom_tanque",
    nullable: true,
    length: 30,
  })
  nomTanque: string | null;

  @Column("character varying", { name: "orden", nullable: true, length: 50 })
  orden: string | null;

  @Column("character varying", { name: "sector", nullable: true, length: 254 })
  sector: string | null;

  @Column("character varying", {
    name: "capacidad",
    nullable: true,
    length: 254,
  })
  capacidad: string | null;

  @Column("character varying", { name: "numero", nullable: true, length: 254 })
  numero: string | null;
}
