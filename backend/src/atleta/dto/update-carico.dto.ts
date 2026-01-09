import { IsInt, IsUUID, Min, Max, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCaricoDto {
    @IsUUID()
    id_atleta: string;

    @IsInt()
    @Min(1)
    @Max(3)
    n_chiamata: number;

    @Type(() => Number)
    @IsNumber()
    carico: number;
}
