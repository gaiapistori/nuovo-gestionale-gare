import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { GaraService } from './gara.service';

@Controller('api/gara')
export class GaraController {
    constructor(private readonly garaService: GaraService) { }

    @Get()
    getGaraInCorso() {
        return this.garaService.getGaraAttuale();
    }

    @Post('avvia')
    avviaGara(@Body() body: { gruppo: string; genere: string }) {
        console.info('GARA -> AVVIA');
        return this.garaService.avviaGara(body.gruppo, body.genere);
    }

    @Patch('avanza')
    avanzaGara() {
        console.info('GARA -> AVANZA, PROSSIMO ATLETA');
        return this.garaService.avanzaGara();
    }
}
