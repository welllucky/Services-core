import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Enterprise } from "./enterprise.entity";
import { Address } from "./address.entity";

@Entity({ name: "Subsidiary" })
export class Subsidiary {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 255 })
    name!: string;

    @Column({ default: false })
    isMatriz!: boolean;

    @ManyToOne(() => Address, { nullable: true })
    @JoinColumn({ name: "fk_address_id" })
    address!: Address;

    @ManyToOne(() => Enterprise, { nullable: true })
    @JoinColumn({ name: "fk_enterprise_cnpj" })
    enterprise!: Enterprise;

    // @ManyToOne(() => Subsidiary, { nullable: true })
    // @JoinColumn({ name: "parent_id" })
    // parent!: Subsidiary;
}
