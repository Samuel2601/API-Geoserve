import { Column, Entity, Index } from "typeorm";

@Index("geo_predio_general_pkey", ["id"], { unique: true })
@Entity("geo_predio_general", { schema: "public" })
export class GeoPredioGeneral {
  @Column("bigint", { primary: true, name: "id" })
  id: string;

  @Column("geometry", { name: "poligono", nullable: true })
  poligono: string | null;

  @Column("character varying", {
    name: "clave_catastral",
    nullable: true,
    length: 50,
  })
  claveCatastral: string | null;

  @Column("character varying", {
    name: "clave_catastral_anterior",
    nullable: true,
    length: 50,
  })
  claveCatastralAnterior: string | null;

  @Column("character varying", {
    name: "tipo_predio",
    nullable: true,
    length: 100,
  })
  tipoPredio: string | null;

  @Column("character varying", { name: "uso", nullable: true, length: 100 })
  uso: string | null;

  @Column("character varying", { name: "agua", nullable: true, length: 100 })
  agua: string | null;

  @Column("character varying", {
    name: "sanitarias",
    nullable: true,
    length: 100,
  })
  sanitarias: string | null;

  @Column("character varying", { name: "energia", nullable: true, length: 100 })
  energia: string | null;

  @Column("character varying", {
    name: "documento_propietario",
    nullable: true,
    length: 50,
  })
  documentoPropietario: string | null;

  @Column("character varying", {
    name: "propietario",
    nullable: true,
    length: 250,
  })
  propietario: string | null;

  @Column("character varying", {
    name: "tipo_persona",
    nullable: true,
    length: 100,
  })
  tipoPersona: string | null;

  @Column("character varying", {
    name: "personeria",
    nullable: true,
    length: 100,
  })
  personeria: string | null;

  @Column("double precision", { name: "area", nullable: true, precision: 53 })
  area: number | null;
}
