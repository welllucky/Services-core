import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "Positions" })
export class Position extends BaseEntity {
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
}
