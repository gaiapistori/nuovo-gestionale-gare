import {
    IsDateString,
    IsIn,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateAtletaDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    nome?: string;

    @IsOptional()
    @IsDateString()
    nascita?: string;

    @IsOptional()
    @IsString()
    @IsIn(['M', 'F'])
    genere?: string;

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

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    d2_carico?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    d3_carico?: number;
}
