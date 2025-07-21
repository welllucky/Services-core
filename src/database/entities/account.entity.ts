import { Roles } from "@/typing";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { Session } from "./session.entity";
import { User } from "./user.entity";

@Entity({ name: "Accounts" })
export class Account {
    @PrimaryGeneratedColumn("increment")
    public readonly id!: string;

    @OneToOne(() => User, (user) => user.account, {
        cascade: ["insert", "update"],
        onDelete: "NO ACTION",
        onUpdate: "CASCADE",
        nullable: false,
    })
    @JoinColumn()
    public user!: Relation<User>;

    @Column({ length: 256, nullable: false })
    public hash!: string;

    @Column({ default: false })
    public isBanned!: boolean;

    @Column({ default: true })
    public canCreateTicket!: boolean;

    @Column({ default: true })
    public canResolveTicket!: boolean;

    @Column({ type: "varchar", default: "user" })
    public role!: Roles;

    @OneToMany(() => Session, (session) => session.account, {
        cascade: ["insert", "update"],
        onDelete: "NO ACTION",
        onUpdate: "CASCADE",
    })
    public readonly sessions!: Session[];

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    public createdAt!: Date;

    @Column({ type: "timestamp", nullable: true })
    public updatedAt!: Date | null;

    @Column({ type: "timestamp", nullable: true })
    public deletedAt!: Date | null;
}