import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Session } from "./session.entity";

@Entity({ name: "Users" })
export class User {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column({ length: 20, unique: true })
  register!: string;

  @Column({ length: 100 })
  name!: string;

  @Column({ length: 256, unique: true })
  email!: string;

  @Column({ length: 256 })
  hash!: string;

  @Column({ type: "datetime", nullable: true })
  lastConnection!: Date | null;

  @Column({ default: false })
  isBanned!: boolean;

  @Column({ default: true })
  canCreateTicket!: boolean;

  @Column({ default: true })
  canResolveTicket!: boolean;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({ type: "datetime", nullable: true })
  updatedAt!: Date | null;

  @Column({ type: "datetime", nullable: true })
  deletedAt!: Date | null;

  @Column({ length: 80 })
  role!: string;

  @Column({ length: 6, default: "user" })
  systemRole!: "admin" | "user" | "manager" | "guest" | "viewer";

  @Column({ length: 80 })
  sector!: string;

  @OneToMany(() => Session, (session) => session.user)
  public sessions!: Session[];
}
