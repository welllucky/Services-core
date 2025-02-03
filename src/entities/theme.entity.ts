import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "Color_scheme" })
export class Theme {
  @PrimaryGeneratedColumn("uuid")
  id!: number;

  @Column({ type: "json" })
  color!: {
    primary: string;
    secondary: string;
    tertiary: string;
  };

  @Column({ type: "json" })
  typography!: {
    tile: string;
    general: string;
  };
}
