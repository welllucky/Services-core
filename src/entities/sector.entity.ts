import {
    BaseEntity,
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Position } from "./position.entity";

@Entity({ name: "Sectors" })
export class Sector extends BaseEntity {
    @PrimaryGeneratedColumn()
    public readonly id!: string;

    @Column({ length: 128, unique: true })
    name!: string;

    @Column({ length: 256 })
    description!: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    public createdAt!: Date;

    @Column({ type: "timestamp", nullable: true })
    public updatedAt!: Date | null;

    @Column({ type: "timestamp", nullable: true })
    public deletedAt!: Date | null;

    @ManyToMany(() => Position, {
        cascade: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    @JoinTable()
    positions!: Position[] | null;
}
