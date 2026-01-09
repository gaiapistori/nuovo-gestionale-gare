import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AtletaService } from '../../service/atleta.service';
import { Atleta, UpdateCaricoDto } from '../../model/atleta.entity';
import { GaraComponent } from "../gara/gara.component";
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck, faX, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { Subscription, switchMap } from 'rxjs';
import { WebsocketService } from '../../service/websocket.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
    selector: 'app-regia-carichi-page',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        GaraComponent,
        FontAwesomeModule,
        NavbarComponent
    ],
    templateUrl: './regia-carichi.component.html',
    styleUrls: ['./regia-carichi.component.scss']
})
export class RegiaCarichiComponent implements OnInit {
    private atletaService = inject(AtletaService);

    faSave = faCheck;
    faCancel = faX;
    faWarn = faTriangleExclamation;

    @ViewChild('editInput') editInput?: ElementRef<HTMLInputElement>;

    displayedColumns = [
        'Nome',
        'Carico 1',
        'Carico 2',
        'Carico 3',
    ];

    atleti: Atleta[] = [];
    private updateSubscriptionCambioAtleta: Subscription;


    // Stato per la modifica inline
    editingCell: { atletaId: string; nChiamata: number } | null = null;
    editValue: number | null = null;
    private shouldFocusInput = false;

    constructor(private wsService: WebsocketService) { }


    ngOnInit(): void {
        this.loadAtleti();

        this.updateSubscriptionCambioAtleta = this.wsService.getGaraCambiata().pipe(
            switchMap(() => {
                return this.atletaService.getAtletiGara();
            })).subscribe(atleti => {
                this.atleti = atleti;
            });
    }

    ngAfterViewChecked(): void {
        if (this.shouldFocusInput && this.editInput) {
            this.editInput.nativeElement.focus();
            this.editInput.nativeElement.select();
            this.shouldFocusInput = false;
        }
    }

    loadAtleti(): void {
        this.atletaService.getAtletiGara().subscribe((res) => {
            this.atleti = res;
        });
    }

    isEditing(atletaId: string, nChiamata: number): boolean {
        return this.editingCell?.atletaId === atletaId &&
            this.editingCell?.nChiamata === nChiamata;
    }

    startEdit(atletaId: string, nChiamata: number, currentValue: number): void {
        const atleta = this.atleti.find(a => a.id === atletaId);
        if (!atleta) return;

        // Verifica se la cella è editabile (dx_valida === null)
        const isEditable = this.isCellEditable(atleta, nChiamata);
        if (!isEditable) return;

        this.editingCell = { atletaId, nChiamata };
        this.editValue = currentValue || null;
        this.shouldFocusInput = true;
    }

    private isCellEditable(atleta: Atleta, nChiamata: number): boolean {
        switch (nChiamata) {
            case 1: return atleta.d1_valida === null;
            case 2: return atleta.d2_valida === null;
            case 3: return atleta.d3_valida === null;
            default: return false;
        }
    }

    saveEdit(atletaId: string, nChiamata: number): void {
        if (this.editValue === null || this.editValue === undefined) {
            this.cancelEdit();
            return;
        }

        const dto: UpdateCaricoDto = {
            id_atleta: atletaId,
            n_chiamata: nChiamata,
            carico: this.editValue
        };

        this.atletaService.updateCarico(dto).subscribe({
            next: (res) => {
                console.log('Carico aggiornato:', res);
                this.cancelEdit();
                this.loadAtleti();
            },
            error: (err) => {
                console.error('Errore aggiornamento carico:', err);
                this.cancelEdit();
            }
        });
    }

    cancelEdit(): void {
        this.editingCell = null;
        this.editValue = null;
    }

    ngOnDestroy(): void {
        if (this.updateSubscriptionCambioAtleta) {
            this.updateSubscriptionCambioAtleta.unsubscribe();
        }
    }
}
