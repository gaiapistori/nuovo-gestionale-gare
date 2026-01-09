import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Gara } from '../../model/gara.entity';
import { Subscription } from 'rxjs';
import { GaraService } from '../../service/gara.service';
import { WebsocketService } from '../../service/websocket.service';

@Component({
    selector: 'app-gara',
    standalone: true,
    imports: [
        CommonModule,
    ],
    templateUrl: './gara.component.html',
    styleUrls: ['./gara.component.scss'],
})
export class GaraComponent implements OnInit {
    private garaService = inject(GaraService);
    private updateSubscriptionGara: Subscription;

    gara: Gara = null;

    constructor(private wsService: WebsocketService) { }


    ngOnInit(): void {
        this.garaService.getGara().subscribe((res) => (this.gara = res));

        this.updateSubscriptionGara = this.wsService.getGaraCambiata().subscribe(update => {
            this.gara = update.value;
            console.log('Gara aggiornata via websocket', this.gara);
        });
    }

    ngOnDestroy(): void {
        // Pulizia
        if (this.updateSubscriptionGara) {
            this.updateSubscriptionGara.unsubscribe();
        }
    }

}
