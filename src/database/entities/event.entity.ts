import type { Relation } from "typeorm";
import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Ticket } from "./ticket.entity";
import { User } from "./user.entity";

@Entity({
    name: "Events",
})
export class Event extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    public readonly id!: string;

    @ManyToOne(() => Ticket, (ticket) => ticket.id, {
        cascade: ["insert", "update"],
        nullable: false,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    @JoinColumn()
    public ticket!: Relation<Ticket>;

    @Column({
        length: 80,
        type: "varchar",
    })
    public title!: string;

    @Column({
        length: 256,
        type: "varchar",
    })
    public description!: string;

    @Column({
        type: "varchar",
        length: 10, // Limite para valores como 'open', 'close', etc.
    })
    public type!: "open" | "close" | "reopen" | "message" | "system";

    @Column({
        type: "varchar",
        length: 10, // Limite para valores como 'public', 'private'.
    })
    public visibility!: "public" | "private";

    @ManyToOne(() => User, (user) => user.register, {
        cascade: ["insert", "update"],
        nullable: true,
        onDelete: "NO ACTION",
        onUpdate: "CASCADE",
    })
    @JoinColumn()
    public readonly createdBy!: Relation<User> | null;

    @Column("timestamp")
    public readonly createdAt!: Date;
}
