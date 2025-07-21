import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { Account } from "./account.entity";
import { Position } from "./position.entity";
import { Sector } from "./sector.entity";

@Entity({ name: "Users" })
export class User {
    @PrimaryGeneratedColumn("increment")
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

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    public createdAt!: Date;

    @Column({ type: "timestamp", nullable: true })
    public updatedAt!: Date | null;

    @Column({ type: "timestamp", nullable: true })
    public deletedAt!: Date | null;

    @ManyToOne(() => Position, (position) => position.id, {
        cascade: ["insert", "update"],
        eager: true,
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
    })
    @JoinColumn()
    public position!: Position;

    @ManyToOne(() => Sector, (sector) => sector.id, {
        cascade: ["insert", "update"],
        eager: true,
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
        nullable: true,
    })
    @JoinColumn()
    public sector!: Sector | null;

    @OneToOne(() => Account, (account) => account.user, {
        cascade: ["insert", "update"],
        onDelete: "NO ACTION",
        onUpdate: "CASCADE",
    })
    public readonly account!: Account;
}
