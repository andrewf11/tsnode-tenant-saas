import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm"
import { Property } from './Property';

@Entity()
export class Unit {

    @PrimaryGeneratedColumn()
    UnitId: number;

    @ManyToOne( type => Property, property => property.Units)
    Property: Property;

    @Column()
    UnitNumber: string;

    @Column()
    Bedrooms!: number;

    @Column()
    Baths!: number;

    @Column()
    SqFt!: number;

    @Column()
    Garage!: Boolean;

    @Column()
    Smoking!: Boolean;

    @Column()
    Description!: string;

    //Add photos
}