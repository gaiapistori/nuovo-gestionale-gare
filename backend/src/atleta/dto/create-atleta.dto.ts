import {
    IsDateString,
    IsIn,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAtletaDto {
    @IsString()
    @IsNotEmpty()
    nome: string;

    @IsDateString()
    nascita: string;

    @IsString()
    @IsIn(['M', 'F'])
    genere: string;

    @IsOptional()
    @IsString()
    gruppo?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    peso?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    d1_carico?: number;
}
