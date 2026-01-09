import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { AtletaService } from './atleta.service';
import { CreateAtletaDto } from './dto/create-atleta.dto';
import { UpdateValidaDto } from './dto/update-valida.dto';
import { UpdateCaricoDto } from './dto/update-carico.dto';
import { UpdateAtletaDto } from './dto/update-atleta.dto';

@Controller('api/atleti')
export class AtletaController {
    constructor(private readonly atletaService: AtletaService) { }

    // lista di TUTTI gli atleti
    @Get()
    getAtleti() {
        console.info('GET ATLETI');
        return this.atletaService.getAtleti();
    }

    // lista di atleti della GARA ATTUALE
    @Get('gara')
    getAtletiGaraAttuale() {
        return this.atletaService.getAtletiGaraAttuale();
    }

    @Get('attuale')
    getAtletaAttuale() {
        console.info('GET ATTUALE ATLETA -> REGIA');
        return this.atletaService.getAttuale();
    }

    @Get('prossimo')
    getProssimoAtleta() {
        console.info('GET PROSSIMO ATLETA -> REGIA');
        return this.atletaService.getProssimo();
    }

    @Get('lista-chiamate')
    getListaChiamateGara(
        @Query('genere') genere: string,
        @Query('gruppo') gruppo: string,
        @Query('chiamata') chiamata: number) {
        console.info('GET LISTA CHIAMATE');
        return this.atletaService.getListaChiamateGara(gruppo, genere, chiamata);
    }

    @Get('classifica')
    getClassificaGara(
        @Query('genere') genere: string,
        @Query('gruppo') gruppo: string,
        @Query('junior') junior: boolean) {
        console.info('GET CLASSIFICA GARA');
        return this.atletaService.getClassificaGara(genere, gruppo, junior);
    }

    @Get('classifica-assoluto')
    getClassificaAssolutoGara(
        @Query('genere') genere: string,
        @Query('gruppo') gruppo: string,
        @Query('junior') junior: boolean) {
        console.info('GET CLASSIFICA ASSOLUTO GARA');
        return this.atletaService.getClassificaAssolutoGara(genere, gruppo, junior);
    }

    @Post()
    createAtleta(@Body() dto: CreateAtletaDto) {
        console.info('POST ricevuto!');
        try {
            console.info('POST ricevuto!', dto);
            return this.atletaService.createAtleta(dto);
        } catch (error) {
            console.info('Errore creazione atleta:', error);
            throw error; // o return { error: error.message }
        }
    }

    @Patch('update/:id')
    updateAtleta(@Param('id') id: string, @Body() dto: UpdateAtletaDto) {
        return this.atletaService.updateAtleta(id, dto);
    }

    @Patch('update-valida')
    updateValida(@Body() dto: UpdateValidaDto) {
        console.info('Aggiornando VALIDITA ATLETA:', dto);
        return this.atletaService.updateValida(
            dto.id_atleta,
            dto.n_chiamata,
            dto.validita,
        );
    }

    @Patch('update-carico')
    updateCarico(@Body() dto: UpdateCaricoDto) {
        console.info('Aggiornando CARICO ATLETA:', dto);
        return this.atletaService.updateCarico(
            dto.id_atleta,
            dto.n_chiamata,
            dto.carico,
        );
    }

}
