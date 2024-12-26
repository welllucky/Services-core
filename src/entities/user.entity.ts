import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Session } from "./session.entity";
import { SystemRoles } from "@/typing";

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

  @Column({ type: "varchar" })
  public role!: string;

  @Column({ type: "varchar", default: "user" })
  public systemRole!: SystemRoles;

  @Column({ type: "varchar" })
  public sector!: string;

  @OneToMany(() => Session, (session) => session.user)
  public readonly sessions!: Session[];
}
