import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },

    {
        path: 'home',
        loadComponent: () =>
            import('./home/home.component').then(m => m.HomeComponent)
    },

    {
        path: 'atleti',
        loadComponent: () =>
            import('./atleti/atleti.component').then(m => m.AtletiComponent)
    },

    {
        path: 'schermo',
        loadComponent: () =>
            import('./schermo/schermo.component').then(m => m.SchermoComponent)
    },

    {
        path: 'schermo',
        loadComponent: () =>
            import('./schermo/schermo.component').then(m => m.SchermoComponent)
    },

    {
        path: 'lista-chiamate-gara',
        loadComponent: () =>
            import('./lista-chiamate-gara/lista-chiamate-gara.component').then(m => m.ListaChiamateGaraComponent)
    },

    {
        path: 'lista-chiamate-query',
        loadComponent: () =>
            import('./lista-chiamate-query/lista-chiamate-query.component').then(m => m.ListaChiamateQueryComponent)
    },

    {
        path: 'avvia-gara',
        loadComponent: () =>
            import('./avvia-gara/avvia-gara.component').then(m => m.AvviaGaraComponent)
    },

    {
        path: 'giuria',
        loadComponent: () =>
            import('./giuria/giuria.component').then(m => m.GiuriaComponent)
    },


    {
        path: 'speaker',
        loadComponent: () =>
            import('./speaker/speaker.component').then(m => m.SpeakerComponent)
    },

    {
        path: 'classifica',
        loadComponent: () =>
            import('./classifica/classifica.component').then(m => m.ClassificaComponent)
    },

    {
        path: 'classifica-assoluto',
        loadComponent: () =>
            import('./classifica-assoluto/classifica-assoluto.component').then(m => m.ClassificaAssolutoComponent)
    },

    {
        path: 'regia-carichi',
        loadComponent: () =>
            import('./regia-carichi/regia-carichi.component').then(m => m.RegiaCarichiComponent)
    },

    { path: '**', redirectTo: 'home' } // fallback
];
