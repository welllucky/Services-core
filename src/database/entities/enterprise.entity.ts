import {
    Column,
    Entity,
    JoinColumn,
    ManyToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Theme } from "./theme.entity";

@Entity({ name: "Enterprise" })
export class Enterprise {
    @PrimaryGeneratedColumn("increment")
    id!: string;

    @Column({ unique: true, length: 64 })
    register!: string;

    @Column({ length: 255 })
    name!: string;

    @Column({ length: 100, nullable: true })
    nationality!: string;

    @Column({ type: "datetime", nullable: true })
    createdAt!: Date;

    @Column({ type: "blob", nullable: true })
    logo!: Buffer;

    @Column({ length: 100, nullable: true })
    type!: string;

    @ManyToMany(() => Theme)
    @JoinColumn({ name: "fk_color_scheme_pk" })
    themes!: Theme;
}
