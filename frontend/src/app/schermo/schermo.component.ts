import { Component, HostListener, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Gara } from '../../model/gara.entity';
import { Atleta } from '../../model/atleta.entity';
import { GaraService } from '../../service/gara.service';
import { Subscription, switchMap, tap } from 'rxjs';
import { WebsocketService } from '../../service/websocket.service';
import { AtletaService } from '../../service/atleta.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPause } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-schermo-page',
    standalone: true,
    imports: [
        CommonModule,
        FontAwesomeModule
    ],
    templateUrl: './schermo.component.html',
    styleUrls: ['./schermo.component.scss'],
})
export class SchermoComponent implements OnInit {
    private garaService = inject(GaraService);
    private atletaService = inject(AtletaService);

    private updateSubscriptionValidita: Subscription;
    private updateSubscriptionCambioAtleta: Subscription;


    gara: Gara;
    atleta: Atleta = null;

    semaforo: boolean | null = null;

    pesi = [
        { name: "d25", quantita: 0, class: 'rosso' }, //idx 0
        { name: "d20", quantita: 0, class: 'blu' }, //idx 1
        { name: "d15", quantita: 0, class: 'giallo' }, //idx 2
        { name: "d10", quantita: 0, class: 'verde' }, //idx 3
        { name: "d5", quantita: 0, class: 'bianco' }, //idx 4
        { name: "d250", quantita: 0, class: 'grigio' }, //idx 5
        { name: "d125", quantita: 0, class: 'bianco' }, //idx 6
    ];

    // timer
    timeLeft: number = 60; // secondi
    displayTime: string = '1:00';
    private intervalId: any = null;
    isRunning: boolean = false;

    // icon
    faPause = faPause;

    // gara finita
    garaFinita: boolean = false;

    constructor(private wsService: WebsocketService) { }


    ngOnInit(): void {
        this.semaforo = null;
        this.garaService.getGara().pipe(
            switchMap(res => {
                this.gara = res;
                return this.atletaService.getAttuale();
            })
        ).subscribe((res) => {
            this.atleta = res?.atleta;
            this.setPesi();
            this.semaforo = this.getValida();
            this.restart();
        });

        this.updateSubscriptionValidita = this.wsService.getValiditaAggiornata().subscribe(update => {
            this.atleta = update.value;
            this.semaforo = this.getValida();
        });

        this.updateSubscriptionCambioAtleta = this.wsService.getGaraCambiata().pipe(
            switchMap(update => {
                this.gara = update.value;
                this.semaforo = null;
                this.garaFinita = update.garaFinita;
                return this.atletaService.getAttuale();
            })).subscribe(atleta => {
                this.atleta = atleta?.atleta;
                this.setPesi();
                this.restart()
            });


    }

    ngOnDestroy(): void {
        if (this.updateSubscriptionValidita) {
            this.updateSubscriptionValidita.unsubscribe();
        }
        if (this.updateSubscriptionCambioAtleta) {
            this.updateSubscriptionCambioAtleta.unsubscribe();
        }
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }


    getCarico(): number {
        let carico = 0;
        switch (this.gara?.nChiamata) {
            case 1:
                carico = this.atleta?.d1_carico || 0;
                break;
            case 2:
                carico = this.atleta?.d2_carico || 0;
                break;
            case 3:
                carico = this.atleta?.d3_carico || 0;
                break;
            default:
                break;
        }
        return carico;
    }

    getValida(): boolean {
        let valida = null;
        switch (this.gara?.nChiamata) {
            case 1:
                valida = this.atleta?.d1_valida;
                break;
            case 2:
                valida = this.atleta?.d2_valida;
                break;
            case 3:
                valida = this.atleta?.d3_valida;
                break;
            default:
                break;
        }
        return valida;
    }

    setPesi() {
        // carico - bilanciere
        const carico = this.getCarico();
        let aux = (carico - 20) / 2;
        // dischi da 25
        let d25 = Math.floor(aux / 25);
        this.pesi[0].quantita = d25;
        aux = aux - d25 * 25;
        // dischi da 20
        let d20 = Math.floor(aux / 20);
        this.pesi[1].quantita = d20;
        aux = aux - d20 * 20;
        // dischi da 15
        let d15 = Math.floor(aux / 15);
        this.pesi[2].quantita = d15;
        aux = aux - d15 * 15;
        // dischi da 10
        let d10 = Math.floor(aux / 10);
        this.pesi[3].quantita = d10;
        aux = aux - d10 * 10;
        // dischi da 5
        let d5 = Math.floor(aux / 5);
        this.pesi[4].quantita = d5;
        aux = aux - d5 * 5;
        // dischi da 2.5
        let d250 = Math.floor(aux / 2.5);
        this.pesi[5].quantita = d250;
        aux = aux - d250 * 2.5;
        // dischi da 1.25
        let d125 = Math.floor(aux / 1.25);
        console.log(aux, aux / 1.25, Math.floor(aux / 1.25));
        this.pesi[6].quantita = d125;
    }

    restart(): void {
        // Ferma il timer se è in esecuzione
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }

        // Resetta i valori
        this.timeLeft = 60;
        this.displayTime = '1:00';
        this.isRunning = true;

        // Avvia il timer se atleta esiste
        if (this.atleta) {
            this.startTimer();
        }

    }

    playPause(): void {
        if (this.isRunning) {
            // Metti in pausa
            if (this.intervalId) {
                clearInterval(this.intervalId);
                this.intervalId = null;
            }
            this.isRunning = false;
        } else {
            // Riprendi
            this.isRunning = true;
            this.startTimer();
        }
    }

    private startTimer(): void {
        this.intervalId = setInterval(() => {
            if (this.timeLeft > 0) {
                this.timeLeft--;
                this.updateDisplay();
            } else {
                // Timer terminato
                clearInterval(this.intervalId);
                this.intervalId = null;
                this.isRunning = false;
                // Puoi aggiungere qui un evento o callback quando il timer finisce
            }
        }, 1000);
    }

    private updateDisplay(): void {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.displayTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    @HostListener('window:keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent): void {
        if (event.key === 'p' || event.key === 'P') {
            this.playPause();
            event.preventDefault(); // Previene comportamenti default
        }
        if (event.key === 'r' || event.key === 'R') {
            this.restart();
            event.preventDefault(); // Previene comportamenti default
        }
    }

}
