// src/app/core/services/atleta.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Gara } from '../model/gara.entity';

@Injectable({ providedIn: 'root' })
export class GaraService {
    private http = inject(HttpClient);
    private baseUrl = '/api/gara';

    getGara(): Observable<Gara> {
        return this.http.get<Gara>(this.baseUrl);
    }

    avviaGara(gruppo: string, genere: string): Observable<Gara> {
        return this.http.post<Gara>(`${this.baseUrl}/avvia`, { gruppo, genere });
    }

    avanzaGara(): Observable<Gara> {
        return this.http.patch<Gara>(`${this.baseUrl}/avanza`, {});
    }
}
