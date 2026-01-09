import { IsNumber } from 'class-validator';

export class AvanzaGaraDto {
    @IsNumber()
    n_chiamata: number;

    @IsNumber()
    id_atleta_attuale: number;
}
