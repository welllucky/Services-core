import type { Relation } from "typeorm";
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { User } from "./user.entity";

@Entity({
    name: "Sessions",
})
class Session {
    @PrimaryGeneratedColumn("increment")
    public readonly id!: string;

    @ManyToOne(() => User, (user) => user.sessions, {
        cascade: ["insert", "update"],
        nullable: false,
        onDelete: "NO ACTION",
        onUpdate: "CASCADE",
    })
    @JoinColumn()
    public user!: Relation<User>;

    @Column("timestamp")
    public expiresAt!: Date;

    @Column("timestamp")
    public createdAt!: Date;

    @Column("boolean", {
        default: true,
    })
    public isActive!: boolean;
}

export { Session };
