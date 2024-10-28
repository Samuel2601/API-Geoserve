import { Column, Entity, Index } from "typeorm";

@Index("LINEA_CONDUCCIÓN_pkey", ["id"], { unique: true })
@Entity("LINEA_CONDUCCIÓN", { schema: "public" })
export class LineaConducciN {
  @Column("integer", { primary: true, name: "id" })
  id: number;

  @Column("geometry", { name: "geom", nullable: true })
  geom: string | null;

  @Column("bigint", { name: "fid_", nullable: true })
  fid: string | null;

  @Column("character varying", { name: "diámetro", nullable: true, length: 7 })
  diMetro: string | null;

  @Column("character varying", {
    name: "descripci",
    nullable: true,
    length: 30,
  })
  descripci: string | null;

  @Column("double precision", { name: "long", nullable: true, precision: 53 })
  long: number | null;
}
