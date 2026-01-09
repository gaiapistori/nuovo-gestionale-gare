import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    MAT_DIALOG_DATA,
    MatDialogRef,
    MatDialogModule,
} from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import {
    AtletaService,
} from '../../../service/atleta.service';
import { Atleta, CreateAtletaDto, UpdateAtletaDto } from '../../../model/atleta.entity';

type DialogData =
    | { mode: 'create' }
    | { mode: 'edit'; atleta: Atleta };

@Component({
    selector: 'app-atleta-edit-dialog',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
    ],
    templateUrl: './atleta-edit-dialog.component.html',
    styleUrl: './atleta-edit-dialog.component.scss'
})
export class AtletaEditDialogComponent {
    private fb = inject(FormBuilder);
    private atletaService = inject(AtletaService);
    private dialogRef = inject(MatDialogRef<AtletaEditDialogComponent, 'saved' | 'cancel'>);

    constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) { }

    form = this.fb.group({
        nome: ['', Validators.required],
        nascita: ['', Validators.required],
        genere: ['M', Validators.required],
        gruppo: [''],
        peso: [null as number | null],
        d1_carico: [null as number | null],
        d2_carico: [null as number | null],
        d3_carico: [null as number | null],
    });

    ngOnInit(): void {
        if (this.data.mode === 'edit') {
            const a = this.data.atleta;
            this.form.patchValue({
                nome: a.nome,
                nascita: a.nascita?.substring(0, 10),
                genere: a.genere,
                gruppo: a.gruppo,
                peso: a.peso,
                d1_carico: a.d1_carico,
                d2_carico: a.d2_carico,
                d3_carico: a.d3_carico,
            });
        }
    }

    save(): void {
        if (this.form.invalid) return;
        const raw = this.form.value;

        const payload: CreateAtletaDto | UpdateAtletaDto = {
            nome: raw.nome!,
            nascita: raw.nascita!, // string YYYY-MM-DD
            genere: raw.genere as 'M' | 'F',
            gruppo: raw.gruppo ?? '',
            peso: raw.peso ?? null,
            d1_carico: raw.d1_carico ?? null,
            d2_carico: raw.d2_carico ?? null,
            d3_carico: raw.d3_carico ?? null,
        };

        if (this.data.mode === 'create') {
            this.atletaService.createAtleta(payload as CreateAtletaDto).subscribe(() => {
                this.dialogRef.close('saved');
            });
        } else {
            this.atletaService
                .updateAtleta(this.data.atleta.id, payload as UpdateAtletaDto)
                .subscribe(() => {
                    this.dialogRef.close('saved');
                });
        }
    }

    cancel(): void {
        this.dialogRef.close('cancel');
    }
}
