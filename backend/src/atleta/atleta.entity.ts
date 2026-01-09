import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
} from 'typeorm';

@Entity({ name: 'atleta' })
export class Atleta {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    nome: string;

    @Column({ type: 'date', nullable: false })
    nascita: Date;

    @Column({ type: 'char', length: 1, nullable: false })
    genere: string; // 'M' | 'F'

    @Column({ type: 'varchar', length: 50, nullable: true })
    gruppo: string | null;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    peso: string | null;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    d1_carico: string | null;

    @Column({ type: 'boolean', nullable: true, default: null })
    d1_valida: boolean | null;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    d2_carico: string | null;

    @Column({ type: 'boolean', nullable: true, default: null })
    d2_valida: boolean | null;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    d3_carico: string | null;

    @Column({ type: 'boolean', nullable: true, default: null })
    d3_valida: boolean | null;
}
