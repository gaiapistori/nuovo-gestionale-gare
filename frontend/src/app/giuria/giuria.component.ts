import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AtletaService } from '../../service/atleta.service';
import { GaraService } from '../../service/gara.service';
import { Gara } from '../../model/gara.entity';
import { Atleta, UpdateValidaDto } from '../../model/atleta.entity';
import { GaraComponent } from "../gara/gara.component";
import { WebsocketService } from '../../service/websocket.service';
import { Subscription, switchMap, tap } from 'rxjs';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
    selector: 'app-atleti-page',
    standalone: true,
    imports: [
        CommonModule,
        GaraComponent,
        NavbarComponent
    ],
    templateUrl: './giuria.component.html',
    styleUrls: ['./giuria.component.scss']
})
export class GiuriaComponent implements OnInit {
    private atletaService = inject(AtletaService);
    private garaService = inject(GaraService);
    private updateSubscription: Subscription;

    displayedColumns = [
        'Nome',
        'Carico',
    ];

    atleta: Atleta = null;
    gara: Gara = null

    constructor(private wsService: WebsocketService) { }

    ngOnInit(): void {
        this.atletaService.getAttuale().subscribe((res) => (this.atleta = res?.atleta));
        this.garaService.getGara().subscribe((gara) => (this.gara = gara));

        this.updateSubscription = this.wsService.getGaraCambiata().pipe(
            switchMap(update => {
                this.gara = update.value;
                return this.atletaService.getAttuale();
            })
        ).subscribe(atleta => {
            this.atleta = atleta?.atleta;
        });
    }

    ngOnDestroy(): void {
        if (this.updateSubscription) {
            this.updateSubscription.unsubscribe();
        }
    }


    setValidita(valida: boolean): void {
        if (!this.atleta) {
            console.error("Nessun atleta attuale selezionato.");
            return;
        }
        const dto: UpdateValidaDto = {
            id_atleta: this.atleta.id,
            n_chiamata: this.gara.nChiamata,
            validita: valida
        };
        this.atletaService.updateValida(dto).subscribe(
            updatedAtleta => {
                console.log("Valutazione aggiornata con successo:", updatedAtleta);
                this.atleta = updatedAtleta; // Aggiorna l'atleta locale con i nuovi dati
            },
            error => {
                console.error("Errore durante l'aggiornamento della valutazione:", error);
            }
        );
    }

}
