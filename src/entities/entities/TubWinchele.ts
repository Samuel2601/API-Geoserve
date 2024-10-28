import { Column, Entity, Index } from "typeorm";

@Index("Tub_Winchele_pkey", ["id"], { unique: true })
@Entity("Tub_Winchele", { schema: "public" })
export class TubWinchele {
  @Column("integer", { primary: true, name: "id" })
  id: number;

  @Column("geometry", { name: "geom", nullable: true })
  geom: string | null;

  @Column("bigint", { name: "fid_", nullable: true })
  fid: string | null;

  @Column("character varying", { name: "entity", nullable: true, length: 16 })
  entity: string | null;

  @Column("character varying", { name: "layer", nullable: true, length: 254 })
  layer: string | null;

  @Column("integer", { name: "color", nullable: true })
  color: number | null;

  @Column("character varying", {
    name: "linetype",
    nullable: true,
    length: 254,
  })
  linetype: string | null;

  @Column("double precision", {
    name: "elevation",
    nullable: true,
    precision: 53,
  })
  elevation: number | null;

  @Column("integer", { name: "linewt", nullable: true })
  linewt: number | null;

  @Column("character varying", { name: "refname", nullable: true, length: 254 })
  refname: string | null;

  @Column("bigint", { name: "nivel", nullable: true })
  nivel: string | null;

  @Column("character varying", { name: "e22", nullable: true, length: 4 })
  e22: string | null;

  @Column("character varying", { name: "diametro", nullable: true, length: 5 })
  diametro: string | null;

  @Column("character varying", { name: "tanque", nullable: true, length: 16 })
  tanque: string | null;

  @Column("character varying", { name: "canton", nullable: true, length: 15 })
  canton: string | null;
}
