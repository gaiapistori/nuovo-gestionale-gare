import { IsBoolean, IsInt, IsUUID, Min, Max } from 'class-validator';

export class AtletaClassificaDto {
    id: string;
    nome: string;
    nascita: Date;
    genere: string;
    gruppo: string | null;
    d1_carico: string | null;
    d1_valida: boolean | null;
    d2_carico: string | null;
    d2_valida: boolean | null;
    d3_carico: string | null;
    d3_valida: boolean | null;

    carico_massimo: number | null; // NEW
    punteggio: number | null; // NEW , decimale
}
