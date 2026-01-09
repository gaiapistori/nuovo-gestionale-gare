export interface Atleta {
    id: string;
    nome: string;
    nascita: string;   // ISO date
    genere: 'M' | 'F';
    gruppo: string;
    peso: number;
    d1_carico: number;
    d1_valida: boolean;
    d2_carico: number;
    d2_valida: boolean;
    d3_carico: number;
    d3_valida: boolean;
}

export interface CreateAtletaDto extends Omit<Atleta, 'id'> { }
export interface UpdateAtletaDto extends Partial<CreateAtletaDto> { }

export interface UpdateCaricoDto {
    id_atleta: string;
    n_chiamata: number;
    carico: number;
}

export interface UpdateValidaDto {
    id_atleta: string;
    n_chiamata: number;
    validita: boolean;
}

export interface AtletaClassifica {
    id: string;
    nome: string;
    nascita: string;   // ISO date
    genere: string;
    gruppo: string | null;
    d1_carico: number | null;
    d1_valida: boolean | null;
    d2_carico: number | null;
    d2_valida: boolean | null;
    d3_carico: number | null;
    d3_valida: boolean | null;

    carico_massimo: number | null;
    punteggio: number | null;
}