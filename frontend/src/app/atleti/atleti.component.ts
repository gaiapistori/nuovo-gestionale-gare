import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AtletaService } from '../../service/atleta.service';
import { AtletaEditDialogComponent } from './atleta-edit-dialog/atleta-edit-dialog.component';
import { Atleta } from '../../model/atleta.entity';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
    selector: 'app-atleti-page',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        NavbarComponent
    ],
    templateUrl: './atleti.component.html',
    styleUrls: ['./atleti.component.scss']
})
export class AtletiComponent implements OnInit {
    private atletaService = inject(AtletaService);
    private dialog = inject(MatDialog);

    displayedColumns = [
        'Nome',
        'Nascita',
        'Genere',
        'Gruppo',
        'Peso',
        'Carico 1',
        'Carico 2',
        'Carico 3',
        'Azioni'
    ];

    atleti: Atleta[] = [];

    ngOnInit(): void {
        this.loadAtleti();
    }

    loadAtleti(): void {
        this.atletaService.getAtleti().subscribe((res) => (this.atleti = res));
    }

    openCreate(): void {
        const dialogRef = this.dialog.open(AtletaEditDialogComponent, {
            width: '500px',
            data: { mode: 'create' as const },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result === 'saved') {
                this.loadAtleti();
            }
        });
    }

    openEdit(atleta: Atleta): void {
        const dialogRef = this.dialog.open(AtletaEditDialogComponent, {
            width: '500px',
            data: { mode: 'edit' as const, atleta },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result === 'saved') {
                this.loadAtleti();
            }
        });
    }
}
