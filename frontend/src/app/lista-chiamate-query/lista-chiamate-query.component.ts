import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AtletaService } from '../../service/atleta.service';
import { Atleta } from '../../model/atleta.entity';
import { WebsocketService } from '../../service/websocket.service';
import { Subscription, switchMap } from 'rxjs';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
    selector: 'app-lista-chiamate-query-page',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NavbarComponent
    ],
    templateUrl: './lista-chiamate-query.component.html',
    styleUrls: ['./lista-chiamate-query.component.scss']
})
export class ListaChiamateQueryComponent implements OnInit {
    private atletaService = inject(AtletaService);
    private updateSubscriptionCarico: Subscription;

    displayedColumns = [
        'Indice',
        'Nome',
        'Carico',
    ];

    atleti: Atleta[] = [];
    form: FormGroup;
    gruppo: string;
    genere: string

    constructor(private wsService: WebsocketService, private fb: FormBuilder) {
        this.form = this.fb.group({
            genere: ['M'],          // M o F
            gruppo: ['esordienti'], // esordienti o avanzati
        });
    }

    onSubmit() {
        this.genere = this.form.value.genere;
        this.gruppo = this.form.value.gruppo;
        this.atletaService.getListaChiamate(this.gruppo, this.genere, 1).subscribe((atleti) => {
            this.atleti = atleti;
        })
    }

    ngOnInit(): void {
        this.updateSubscriptionCarico = this.wsService.getCaricoAggiornato()
            .pipe(
                // gruppo 1 => chiamata in corso
                switchMap(() => {
                    return this.atletaService.getListaChiamate(this.gruppo, this.genere, 1)
                }),
            )
            .subscribe(atleti => {
                this.atleti = atleti;
            });
    }

    ngOnDestroy(): void {
        if (this.updateSubscriptionCarico) {
            this.updateSubscriptionCarico.unsubscribe();
        }
    }

}
