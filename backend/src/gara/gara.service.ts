import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Gara } from './gara.entity';
import { Repository } from 'typeorm';
import { AtletaService } from 'src/atleta/atleta.service';
import { UpdatesGateway } from 'src/updates/updates.gateway';
import { Atleta } from 'src/atleta/atleta.entity';


@Injectable()
export class GaraService {
    constructor(
        @InjectRepository(Gara)
        private readonly garaRepo: Repository<Gara>,
        @Inject(forwardRef(() => AtletaService))
        private readonly atletaService: AtletaService,
        private updatesGateway: UpdatesGateway
    ) { }

    private async getSingleGara(): Promise<Gara> {
        const gara = await this.garaRepo.findOne({ where: {} });
        if (!gara) {
            throw new NotFoundException('Configurazione gara non trovata');
        }
        return gara;
    }

    async getGaraAttuale(): Promise<Gara> {
        return this.getSingleGara();
    }

    async avviaGara(gruppo: string, genere: string): Promise<Gara> {
        let gara = await this.garaRepo.findOne({ where: {} });
        if (!gara) {
            gara = new Gara()
        }
        gara.genere = genere;
        gara.gruppo = gruppo;
        gara.nChiamata = 1;

        let atleti = await this.atletaService.getChiamateDaFare(gruppo, genere, 1);
        gara.idAtletaAttuale = atleti.length > 0 ? atleti[0].id : null;
        const saved = await this.garaRepo.save(gara);
        this.updatesGateway.sendCambioGara(saved, false);
        console.log("Gara avviata:", saved);
        return saved
    }

    async avanzaGara(): Promise<Gara> {
        const gara = await this.getSingleGara();
        let isGaraFinita = false
        // imposta n-chiamata e id atleta
        let new_chiamata = gara.nChiamata;
        let atleti = [];

        let alzateDaFareChiamataAttuale = await this.atletaService.getChiamateDaFare(gara.gruppo, gara.genere, new_chiamata);
        console.log("Alzate da fare chiamata attuale:", alzateDaFareChiamataAttuale.length);
        if (alzateDaFareChiamataAttuale.length > 0) {
            // ci sono ancora atleti da chiamare in questa chiamata
            atleti = alzateDaFareChiamataAttuale;
        }
        else {
            if (new_chiamata == 3) {
                isGaraFinita = true; // fineGara
            }
            else {
                // passo alla chiamata successiva
                new_chiamata += 1;
                atleti = await this.atletaService.getChiamateDaFare(gara.gruppo, gara.genere, new_chiamata);
            }
        }
        gara.nChiamata = new_chiamata;
        gara.idAtletaAttuale = atleti.length === 0 ? null : atleti[0].id;

        const saved = await this.garaRepo.save(gara);
        this.updatesGateway.sendCambioGara(saved, isGaraFinita);
        return saved;
    }
}
