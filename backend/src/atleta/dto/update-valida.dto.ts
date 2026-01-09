import { IsBoolean, IsInt, IsUUID, Min, Max } from 'class-validator';

export class UpdateValidaDto {
    @IsUUID()
    id_atleta: string;

    @IsInt()
    @Min(1)
    @Max(3)
    n_chiamata: number;

    @IsBoolean()
    validita: boolean;
}
