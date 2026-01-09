import { IsNumber, IsString } from 'class-validator';

export class AvviaGaraDto {
    @IsString()
    genere: string;

    @IsString()
    gruppo: string;
}
