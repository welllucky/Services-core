import { SystemRoles } from "@/typing";
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Role } from "./role.entity";
import { Sector } from "./sector.entity";
import { Session } from "./session.entity";

@Entity({ name: "Users" })
export class User {
  @PrimaryGeneratedColumn()
  public readonly id!: string;

  @Index({
    unique: true,
  })
  @Column({ length: 10 })
  public register!: string;

  @Column({ length: 100 })
  public name!: string;

  @Index({
    unique: true,
  })
  @Column({ length: 256 })
  public email!: string;

  @Column({ length: 256, nullable: false })
  public hash!: string;

  @Column({ type: "timestamp", nullable: true })
  public lastConnection!: Date | null;

  @Column({ default: false })
  public isBanned!: boolean;

  @Column({ default: true })
  public canCreateTicket!: boolean;

  @Column({ default: true })
  public canResolveTicket!: boolean;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  public createdAt!: Date;

  @Column({ type: "timestamp", nullable: true })
  public updatedAt!: Date | null;

  @Column({ type: "timestamp", nullable: true })
  public deletedAt!: Date | null;

  @ManyToOne(() => Role, (role) => role.id)
  @JoinColumn()
  public role!: Role;

  @Column({ type: "varchar", default: "user" })
  public systemRole!: SystemRoles;

  @ManyToOne(() => Sector, (sector) => sector.id)
  @JoinColumn()
  public sector!: Sector;

  @OneToMany(() => Session, (session) => session.user)
  public readonly sessions!: Session[];
}
