import type { Relation } from "typeorm";
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { Account } from "./account.entity";

@Entity({
    name: "Sessions",
})
class Session {
    @PrimaryGeneratedColumn("increment")
    public readonly id!: string;

    @ManyToOne(() => Account, (account) => account.sessions, {
        cascade: ["insert", "update"],
        nullable: false,
        onDelete: "NO ACTION",
        onUpdate: "CASCADE",
    })
    @JoinColumn()
    public account!: Relation<Account>;

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
