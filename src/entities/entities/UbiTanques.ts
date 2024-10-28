import { Column, Entity, Index } from "typeorm";

@Index("UBI_TANQUES_pkey", ["id"], { unique: true })
@Entity("UBI_TANQUES", { schema: "public" })
export class UbiTanques {
  @Column("integer", { primary: true, name: "id" })
  id: number;

  @Column("geometry", { name: "geom", nullable: true })
  geom: string | null;

  @Column("character varying", { name: "puntos", nullable: true, length: 254 })
  puntos: string | null;

  @Column("double precision", { name: "x", nullable: true, precision: 53 })
  x: number | null;

  @Column("double precision", { name: "y", nullable: true, precision: 53 })
  y: number | null;

  @Column("character varying", { name: "sector", nullable: true, length: 254 })
  sector: string | null;

  @Column("double precision", {
    name: "cota__m_",
    nullable: true,
    precision: 53,
  })
  cotaM: number | null;

  @Column("double precision", {
    name: "volumen__m",
    nullable: true,
    precision: 53,
  })
  volumenM: number | null;

  @Column("character varying", {
    name: "capacidad",
    nullable: true,
    length: 10,
  })
  capacidad: string | null;

  @Column("character varying", { name: "numero", nullable: true, length: 2 })
  numero: string | null;
}
