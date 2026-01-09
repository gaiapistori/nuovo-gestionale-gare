import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { GaraService } from '../../service/gara.service';
import { Gara } from '../../model/gara.entity';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { GaraComponent } from "../gara/gara.component";
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
    selector: 'app-avvia-gara-page',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        GaraComponent,
        NavbarComponent
    ],
    templateUrl: './avvia-gara.component.html',
    styleUrls: ['./avvia-gara.component.scss']
})
export class AvviaGaraComponent implements OnInit {
    private garaService = inject(GaraService);

    gara: Gara = null

    ngOnInit(): void {
        this.garaService.getGara().subscribe((gara) => (this.gara = gara));
    }

    form: FormGroup;

    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            genere: ['M'],          // M o F
            gruppo: ['esordienti'], // esordienti o avanzati
        });
    }

    onSubmit() {
        let genere: string = this.form.value.genere;
        let gruppo: string = this.form.value.gruppo;
        this.garaService.avviaGara(gruppo, genere.charAt(0)).subscribe((gara) => {
            this.gara = gara;
        })
    }

}
