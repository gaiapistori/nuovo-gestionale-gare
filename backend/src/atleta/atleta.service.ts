import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Atleta } from './atleta.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateAtletaDto } from './dto/create-atleta.dto';
import { GaraService } from '../gara/gara.service';
import { UpdateAtletaDto } from './dto/update-atleta.dto';
import { UpdatesGateway } from '../updates/updates.gateway';
import { AtletaClassificaDto } from './dto/atleta-classifica.dto';

@Injectable()
export class AtletaService {
    constructor(
        @InjectRepository(Atleta)
        private readonly atletaRepo: Repository<Atleta>,
        private readonly garaService: GaraService,
        private updatesGateway: UpdatesGateway
    ) { }

    async getAtleti(): Promise<Atleta[]> {
        return this.atletaRepo.find();
    }

    async getAtletiGaraAttuale(): Promise<Atleta[]> {
        const gara = await this.garaService.getGaraAttuale();
        return this.atletaRepo.find({
            where: {
                genere: gara.genere,
                gruppo: gara.gruppo,
            },
            order: { nome: 'ASC' },
        });
    }

    async getClassificaGara(genere: string, gruppo: string, junior: boolean): Promise<AtletaClassificaDto[]> {
        let whereGruppo = {};
        if (gruppo != "*") {
            whereGruppo = { gruppo: gruppo };
        }
        let atleti: Atleta[] = await this.atletaRepo.find({
            where: {
                genere: genere,
                ...whereGruppo,
            }
        });

        // filtro junior (nati dopo 2003)
        atleti = junior
            ? atleti.filter(atleta => {
                const annoNascita = new Date(atleta.nascita).getFullYear();
                return annoNascita >= 2004;
            })
            : atleti;

        // wilks
        const A = genere == 'F' ? 610.328 : 1199.73;
        const B = genere == 'F' ? 1045.59 : 1025.18;
        const C = genere == 'F' ? 0.03048 : 0.00921;

        const classifica: AtletaClassificaDto[] = atleti.map(atleta => {
            // Calcola il carico massimo tra i carichi validi
            const carichiValidi: number[] = [];

            if (atleta.d1_valida && atleta.d1_carico) {
                carichiValidi.push(parseFloat(atleta.d1_carico));
            }
            if (atleta.d2_valida && atleta.d2_carico) {
                carichiValidi.push(parseFloat(atleta.d2_carico));
            }
            if (atleta.d3_valida && atleta.d3_carico) {
                carichiValidi.push(parseFloat(atleta.d3_carico));
            }

            const carico_massimo = carichiValidi.length > 0
                ? Math.max(...carichiValidi)
                : 0;

            // Calcola il coefficiente
            const peso = atleta.peso ? parseFloat(atleta.peso) : 0;
            const coeff = peso > 0
                ? 100 / (A - (B * Math.exp(-C * peso)))
                : 0;

            // Calcola il punteggio
            const punteggio = coeff * carico_massimo;

            return {
                id: atleta.id,
                nome: atleta.nome,
                nascita: atleta.nascita,
                genere: atleta.genere,
                gruppo: atleta.gruppo,
                peso: atleta.peso,
                d1_carico: atleta.d1_carico,
                d1_valida: atleta.d1_valida,
                d2_carico: atleta.d2_carico,
                d2_valida: atleta.d2_valida,
                d3_carico: atleta.d3_carico,
                d3_valida: atleta.d3_valida,
                carico_massimo: carico_massimo,
                punteggio: Math.round(punteggio * 1000) / 1000,
            } as AtletaClassificaDto;
        });
        classifica.sort((a, b) => b.punteggio - a.punteggio);
        return classifica;
    }

    async getClassificaAssolutoGara(genere: string, gruppo: string, junior: boolean): Promise<AtletaClassificaDto[]> {
        let whereGruppo = {};
        if (gruppo != "*") {
            whereGruppo = { gruppo: gruppo };
        }
        let atleti: Atleta[] = await this.atletaRepo.find({
            where: {
                genere: genere,
                ...whereGruppo,
            }
        });

        // filtro junior (nati dopo 2003)
        atleti = junior
            ? atleti.filter(atleta => {
                const annoNascita = new Date(atleta.nascita).getFullYear();
                return annoNascita >= 2004;
            })
            : atleti;

        const classifica: AtletaClassificaDto[] = atleti.map(atleta => {
            // Calcola il carico massimo tra i carichi validi
            const carichiValidi: number[] = [];

            if (atleta.d1_valida && atleta.d1_carico) {
                carichiValidi.push(parseFloat(atleta.d1_carico));
            }
            if (atleta.d2_valida && atleta.d2_carico) {
                carichiValidi.push(parseFloat(atleta.d2_carico));
            }
            if (atleta.d3_valida && atleta.d3_carico) {
                carichiValidi.push(parseFloat(atleta.d3_carico));
            }

            const carico_massimo = carichiValidi.length > 0
                ? Math.max(...carichiValidi)
                : 0;

            return {
                id: atleta.id,
                nome: atleta.nome,
                nascita: atleta.nascita,
                genere: atleta.genere,
                gruppo: atleta.gruppo,
                peso: atleta.peso,
                d1_carico: atleta.d1_carico,
                d1_valida: atleta.d1_valida,
                d2_carico: atleta.d2_carico,
                d2_valida: atleta.d2_valida,
                d3_carico: atleta.d3_carico,
                d3_valida: atleta.d3_valida,
                carico_massimo: carico_massimo,
                punteggio: 0,
            } as AtletaClassificaDto;
        });
        classifica.sort((a, b) => b.carico_massimo - a.carico_massimo);
        return classifica;
    }

    async getListaChiamateGara(gruppo: string, genere: string, chiamata: number): Promise<Atleta[]> {
        const baseWhere = {
            genere: genere,
            gruppo: gruppo,
        };

        let atleti: Atleta[] = [];

        if (chiamata === 1) {
            const d1 = await this.atletaRepo.find({
                where: { ...baseWhere },
                order: { d1_carico: 'ASC', nome: 'ASC' },
            });
            atleti = d1.filter((a) => a.d1_carico !== null);
        } else if (chiamata === 2) {
            const d2 = await this.atletaRepo.find({
                where: { ...baseWhere },
                order: { d2_carico: 'ASC', nome: 'ASC' },
            });
            atleti = d2.filter((a) => a.d2_carico !== null);
        } else if (chiamata === 3) {
            const d3 = await this.atletaRepo.find({
                where: { ...baseWhere },
                order: { d3_carico: 'ASC', nome: 'ASC' },
            });
            atleti = d3.filter((a) => a.d3_carico !== null);
        } else {
            console.error(chiamata, 'chiamata non valido');
            return []
        }

        return atleti;
    }

    async getChiamateDaFare(gruppo: string, genere: string, nChiamata: number): Promise<Atleta[]> {
        const allAtleti = await this.getListaChiamateGara(gruppo, genere, nChiamata);
        switch (nChiamata) {
            case 1:
                return allAtleti.filter(a => a.d1_valida == null);
            case 2:
                return allAtleti.filter(a => a.d2_valida == null);
            case 3:
                return allAtleti.filter(a => a.d3_valida == null);
            default:
                return [];
        }
    }



    async getAtleta(id: string): Promise<Atleta> {
        const atleta = await this.atletaRepo.findOne({ where: { id } });
        if (!atleta) {
            throw new NotFoundException('Atleta non trovato');
        }
        return atleta;
    }

    async getAttuale(): Promise<{ atleta: Atleta, nChiamata: number }> {
        const gara = await this.garaService.getGaraAttuale();
        if (!gara || !gara.idAtletaAttuale) {
            return null;
        }
        const id = gara?.idAtletaAttuale;
        return { atleta: await this.getAtleta(id), nChiamata: gara.nChiamata };
    }

    async getProssimo(): Promise<{ atleta: Atleta, nChiamata: number }> {
        const gara = await this.garaService.getGaraAttuale();
        let nChiamata = gara.nChiamata;
        let alzateDaFareChiamataAttuale = await this.getChiamateDaFare(gara.gruppo, gara.genere, nChiamata);

        let atleta: Atleta = null;

        if (alzateDaFareChiamataAttuale.length > 1) {
            // ci sono ancora atleti da chiamare in questa chiamata
            atleta = alzateDaFareChiamataAttuale[1]; // 0 = atleta in pedana
        }
        else {
            // cerco nella chiamata successiva
            nChiamata = gara.nChiamata + 1;
            const atleti = await this.getChiamateDaFare(gara.gruppo, gara.genere, nChiamata);

            if (nChiamata === 3 && atleti.length == 1) {
                return null; // fine gara
            }
            else {
                atleta = atleti[0];
            }
        }

        if (!atleta) {
            throw new NotFoundException('Atleta non trovato');
        }
        return { atleta, nChiamata };
    }

    async createAtleta(dto: CreateAtletaDto): Promise<Atleta> {
        const atleta = this.atletaRepo.create();
        atleta.nome = dto.nome;
        atleta.nascita = new Date(dto.nascita);
        atleta.genere = dto.genere;
        atleta.gruppo = dto.gruppo ?? null;
        atleta.peso = dto.peso != null ? dto.peso.toFixed(2) : null;
        atleta.d1_carico = dto.d1_carico != null ? dto.d1_carico.toFixed(2) : null;
        atleta.d2_carico = null;
        atleta.d3_carico = null;

        return this.atletaRepo.save(atleta);
    }

    async updateAtleta(id: string, dto: UpdateAtletaDto): Promise<Atleta> {
        const atleta = await this.getAtleta(id);

        if (dto.nome !== undefined) atleta.nome = dto.nome;
        if (dto.nascita !== undefined) atleta.nascita = new Date(dto.nascita);
        if (dto.genere !== undefined) atleta.genere = dto.genere;
        if (dto.gruppo !== undefined) atleta.gruppo = dto.gruppo;
        if (dto.peso != null) atleta.peso = dto.peso != null ? dto.peso.toFixed(2) : null;
        atleta.d1_carico = (dto.d1_carico != null ? dto.d1_carico.toFixed(2) : null);
        atleta.d2_carico = (dto.d2_carico != null ? dto.d2_carico.toFixed(2) : null);
        atleta.d3_carico = (dto.d3_carico != null ? dto.d3_carico.toFixed(2) : null);

        return this.atletaRepo.save(atleta);
    }

    async updateValida(
        id_atleta: string,
        n_chiamata: number,
        validita: boolean,
    ): Promise<Atleta> {
        const atleta = await this.getAtleta(id_atleta);

        if (n_chiamata === 1) {
            atleta.d1_valida = validita;
        } else if (n_chiamata === 2) {
            atleta.d2_valida = validita;
        } else if (n_chiamata === 3) {
            atleta.d3_valida = validita;
        } else {
            throw new Error('n_chiamata non valido');
        }

        const saved: Atleta = await this.atletaRepo.save(atleta);
        this.updatesGateway.sendUpdateValidita(saved);
        return saved;
    }

    async updateCarico(
        id_atleta: string,
        n_chiamata: number,
        carico: number,
    ): Promise<Atleta> {
        const atleta = await this.getAtleta(id_atleta);
        const value = carico.toFixed(2); // salva come string per decimal

        if (n_chiamata === 1) {
            atleta.d1_carico = value;
        } else if (n_chiamata === 2) {
            atleta.d2_carico = value;
        } else if (n_chiamata === 3) {
            atleta.d3_carico = value;
        } else {
            throw new Error('n_chiamata non valido');
        }

        const saved: Atleta = await this.atletaRepo.save(atleta);
        this.updatesGateway.sendUpdateCarico(saved);
        return saved;
    }
}
