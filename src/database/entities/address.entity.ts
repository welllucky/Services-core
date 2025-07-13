import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "Address" })
export class Address {
    @PrimaryGeneratedColumn("increment")
    id!: number;

    @Column({ length: 10 })
    zipCode!: string;

    @Column({ length: 255 })
    street!: string;

    @Column()
    number!: number;

    @Column({ length: 255 })
    district!: string;

    @Column({ length: 255 })
    city!: string;

    @Column({ length: 255 })
    state!: string;

    @Column({ nullable: true, type: "geography" })
    coordinate!: string;

    @Column({ length: 255 })
    country!: string;
}
