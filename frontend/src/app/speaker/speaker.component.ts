import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AtletaService } from '../../service/atleta.service';
import { GaraService } from '../../service/gara.service';
import { Gara } from '../../model/gara.entity';
import { Atleta } from '../../model/atleta.entity';
import { GaraComponent } from "../gara/gara.component";
import { WebsocketService } from '../../service/websocket.service';
import { of, Subscription, switchMap } from 'rxjs';
import { NavbarComponent } from '../navbar/navbar.component';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@Component({
    selector: 'app-speaker-page',
    standalone: true,
    imports: [
        CommonModule,
        GaraComponent,
        NavbarComponent,
        FontAwesomeModule
    ],
    templateUrl: './speaker.component.html',
    styleUrls: ['./speaker.component.scss']
})
export class SpeakerComponent implements OnInit {
    private atletaService = inject(AtletaService);
    private garaService = inject(GaraService);

    private updateSubscription: Subscription;

    faNext = faArrowRight;

    displayedColumns = [
        'Nome',
        'Carico',
    ];

    atletaAttuale: { atleta: Atleta, nChiamata: number } = null;
    atletaProssimo: { atleta: Atleta, nChiamata: number } = null;
    gara: Gara = null

    nextButtonAbilitato: boolean = false

    constructor(private wsService: WebsocketService) { }

    ngOnInit(): void {
        this.garaService.getGara().pipe(
            switchMap((gara) => {
                this.gara = gara;
                return this.atletaService.getAttuale();
            })
        ).subscribe((res) => {
            this.atletaAttuale = res;
            this.nextButtonAbilitato = (this.getValida() != null);
        });
        this.atletaService.getProssimo().subscribe((res) => { this.atletaProssimo = res; console.log('Prossimo atleta init:', res) });

        this.updateSubscription = this.wsService.getValiditaAggiornata()
            .subscribe(update => {
                this.atletaAttuale = { atleta: update.value, nChiamata: this.gara.nChiamata };
                this.nextButtonAbilitato = true;
            });
    }

    ngOnDestroy(): void {
        // Pulizia
        if (this.updateSubscription) {
            this.updateSubscription.unsubscribe();
        }
    }


    setProssimo(): void {
        this.garaService.avanzaGara().pipe(
            switchMap((newGara) => {
                this.gara = newGara;
                this.nextButtonAbilitato = false;
                return this.atletaService.getAttuale();
            }),
            switchMap((attuale) => {
                console.log('Prossimo attuale:', attuale);
                this.atletaAttuale = attuale;
                return this.atletaService.getProssimo();
            }),
            switchMap((prossimo) => {
                console.log('Prossimo atleta:', prossimo);
                this.atletaProssimo = prossimo;
                return of(prossimo); // o EMPTY se non serve ritornare nulla
            })
        ).subscribe();
    }

    getValida(): boolean {
        let valida = null;
        switch (this.gara?.nChiamata) {
            case 1:
                valida = this.atletaAttuale?.atleta.d1_valida;
                break;
            case 2:
                valida = this.atletaAttuale?.atleta.d2_valida;
                break;
            case 3:
                valida = this.atletaAttuale?.atleta.d3_valida;
                break;
            default:
                break;
        }
        return valida;
    }

}
