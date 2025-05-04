import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Role } from "./role.entity";

@Entity({ name: "Sectors" })
export class Sector extends BaseEntity {
  @PrimaryGeneratedColumn()
  public readonly id!: string;

  @Column({ length: 128, unique: true })
  name!: string;

  @Column({ length: 256 })
  description!: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  public createdAt!: Date;

  @Column({ type: "timestamp", nullable: true })
  public updatedAt!: Date | null;

  @Column({ type: "timestamp", nullable: true })
  public deletedAt!: Date | null;

  @ManyToMany(() => Role)
  @JoinTable()
  roles!: Role[];
}
