import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Trips {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        length: 100,
    })
    customer_id!: string;

    @Column({
        length: 100,
    })
    origin!: string;

    @Column({
        length: 100,
    })
    destination!: string;
    
    @Column("double")
    distance!: string;
    
    @Column({
        length: 100,
    })
    duration!: string;
    
    @Column("int")
    driver_id!: number;

    @Column({
        length: 100,
    })
    driver_name!: string;
    
    @Column("double")
    value!: number;

}