// src/gara/gara.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
} from 'typeorm';

@Entity({ name: 'gara' })
export class Gara {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'char', length: 1, nullable: true })
    genere: string | null; // 'M' | 'F'

    @Column({ type: 'varchar', length: 50, nullable: true })
    gruppo: string | null;

    @Column({ type: 'int', nullable: false, default: 1 })
    nChiamata: number;

    @Column({ type: 'uuid', nullable: true })
    idAtletaAttuale: string | null;
}
