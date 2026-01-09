import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AtletaService } from '../../service/atleta.service';
import { GaraService } from '../../service/gara.service';
import { Gara } from '../../model/gara.entity';
import { Atleta } from '../../model/atleta.entity';
import { GaraComponent } from "../gara/gara.component";
import { WebsocketService } from '../../service/websocket.service';
import { of, Subscription, switchMap, tap } from 'rxjs';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
    selector: 'app-lista-chiamate-gara-page',
    standalone: true,
    imports: [
        CommonModule,
        GaraComponent,
        NavbarComponent
    ],
    templateUrl: './lista-chiamate-gara.component.html',
    styleUrls: ['./lista-chiamate-gara.component.scss']
})
export class ListaChiamateGaraComponent implements OnInit {
    private atletaService = inject(AtletaService);
    private garaService = inject(GaraService);

    private updateSubscriptionGara: Subscription;
    private updateSubscriptionCarico: Subscription;

    displayedColumns = [
        'Indice',
        'Nome',
        'Carico',
    ];

    atletiPrimoGruppo: Atleta[] = [];
    atletiSecondoGruppo: Atleta[] = [];
    gara: Gara;

    constructor(private wsService: WebsocketService) { }

    ngOnInit(): void {
        this.garaService.getGara().pipe(
            switchMap((gara) => {
                this.gara = gara;
                return this.atletaService.getListaChiamate(this.gara?.gruppo, this.gara?.genere, this.gara?.nChiamata)
            }),
            // gruppo 2 => chiamata successiva => SSE nChiamata != 3
            switchMap((gruppo1) => {
                this.atletiPrimoGruppo = gruppo1;
                if (this.gara?.nChiamata != 3) {
                    return this.atletaService.getListaChiamate(this.gara?.gruppo, this.gara?.genere, this.gara?.nChiamata + 1)
                }
                else {
                    return of([])
                }
            }),
        ).subscribe(gruppo2 => {
            this.atletiSecondoGruppo = gruppo2;
        });

        this.updateSubscriptionCarico = this.wsService.getCaricoAggiornato()
            .pipe(
                // gruppo 1 => chiamata in corso
                switchMap(() => {
                    return this.atletaService.getListaChiamate(this.gara?.gruppo, this.gara?.genere, this.gara?.nChiamata)
                }),
                // gruppo 2 => chiamata successiva => SSE nChiamata != 3
                switchMap((gruppo1) => {
                    this.atletiPrimoGruppo = gruppo1;
                    if (this.gara?.nChiamata != 3) {
                        return this.atletaService.getListaChiamate(this.gara?.gruppo, this.gara?.genere, this.gara?.nChiamata + 1)
                    }
                    else {
                        return of([])
                    }
                }),
            )
            .subscribe(gruppo2 => {
                this.atletiSecondoGruppo = gruppo2;
            });

        this.updateSubscriptionGara = this.wsService.getGaraCambiata()
            .pipe(
                switchMap((update) => {
                    this.gara = update.value;
                    return this.atletaService.getListaChiamate(this.gara?.gruppo, this.gara?.genere, this.gara?.nChiamata)
                }),
                // gruppo 2 => chiamata successiva => SSE nChiamata != 3
                switchMap((gruppo1) => {
                    this.atletiPrimoGruppo = gruppo1;
                    if (this.gara?.nChiamata != 3) {
                        return this.atletaService.getListaChiamate(this.gara?.gruppo, this.gara?.genere, this.gara?.nChiamata + 1)
                    }
                    else {
                        return of([])
                    }
                }),
            )
            .subscribe(gruppo2 => {
                this.atletiSecondoGruppo = gruppo2;
            });
    }

    ngOnDestroy(): void {
        // Pulizia
        if (this.updateSubscriptionGara) {
            this.updateSubscriptionGara.unsubscribe();
        }
        if (this.updateSubscriptionCarico) {
            this.updateSubscriptionCarico.unsubscribe();
        }
    }

    getValida(atleta: Atleta, nChiamata: number): boolean | null {
        switch (nChiamata) {
            case 1:
                return atleta.d1_valida;
            case 2:
                return atleta.d2_valida;
            case 3:
                return atleta.d3_valida;
            default:
                return null;
        }
    }

    getCarico(atleta: Atleta, nChiamata: number): number | null {
        switch (nChiamata) {
            case 1:
                return atleta.d1_carico;
            case 2:
                return atleta.d2_carico;
            case 3:
                return atleta.d3_carico;
            default:
                return null;
        }
    }

}
