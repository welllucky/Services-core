import type { Relation } from "typeorm";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";

@Entity({
  name: "Sessions",
})
class Session extends BaseEntity {
  @PrimaryGeneratedColumn()
  public readonly id!: string;

  @ManyToOne(() => User, (user) => user.sessions)
  @JoinColumn()
  public user!: Relation<User>;

  @Column("datetime")
  public expiresAt!: Date;

  @Column("datetime")
  public createdAt!: Date;

  @Column("boolean", {
    default: true,
  })
  public isActive!: boolean;
}

export { Session };
