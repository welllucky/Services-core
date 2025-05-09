import { Roles } from "@/typing";
import {
    BaseEntity,
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Position } from "./position.entity";
import { Sector } from "./sector.entity";
import { Session } from "./session.entity";

@Entity({ name: "Users" })
export class User extends BaseEntity {
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

    @Column({ length: 256, nullable: false })
    public hash!: string;

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

    @Column({ type: "varchar", default: "user" })
    public role!: Roles;

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
    })
    @JoinColumn()
    public sector!: Sector;

    @OneToMany(() => Session, (session) => session.user, {
        cascade: ["insert", "update"],
        onDelete: "NO ACTION",
        onUpdate: "CASCADE",
    })
    public readonly sessions!: Session[];
}
