import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AtletaService } from '../../service/atleta.service';
import { AtletaClassifica } from '../../model/atleta.entity';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
    selector: 'app-classifica-page',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NavbarComponent
    ],
    templateUrl: './classifica.component.html',
    styleUrls: ['./classifica.component.scss']
})
export class ClassificaComponent implements OnInit {
    private atletaService = inject(AtletaService);

    displayedColumns = [
        'Posizione',
        'Nome',
        'Prova 1',
        'Prova 2',
        'Prova 3',
        'Migliore',
        'Punteggio'
    ];

    atleti: AtletaClassifica[] = [];
    form: FormGroup;
    gruppo: string;
    genere: string;
    junior: boolean = false;

    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            genere: ['M'],          // M o F
            gruppo: ['*'], // esordienti o avanzati
            junior: false        // true o false
        });
    }

    onSubmit() {
        this.genere = this.form.value.genere;
        this.gruppo = this.form.value.gruppo;
        this.junior = this.form.value.junior;
        this.atletaService.getClassifica(this.genere, this.gruppo, this.junior).subscribe((atleti) => {
            this.atleti = atleti;
        })
    }

    ngOnInit(): void { }
}
