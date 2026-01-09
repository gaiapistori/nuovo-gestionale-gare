import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Atleta, AtletaClassifica, CreateAtletaDto, UpdateAtletaDto, UpdateCaricoDto, UpdateValidaDto } from '../model/atleta.entity';

@Injectable({ providedIn: 'root' })
export class AtletaService {
    private http = inject(HttpClient);
    private baseUrl = '/api/atleti';

    getAtleti(): Observable<Atleta[]> {
        return this.http.get<Atleta[]>(this.baseUrl);
    }

    getAtletiGara(): Observable<Atleta[]> {
        return this.http.get<Atleta[]>(`${this.baseUrl}/gara`);
    }

    getAttuale(): Observable<{ atleta: Atleta, nChiamata: number }> {
        return this.http.get<{ atleta: Atleta, nChiamata: number }>(`${this.baseUrl}/attuale`);
    }

    getProssimo(): Observable<{ atleta: Atleta, nChiamata: number }> {
        return this.http.get<{ atleta: Atleta, nChiamata: number }>(`${this.baseUrl}/prossimo`);
    }

    getListaChiamate(gruppo: string, genere: string, chiamata: number): Observable<Atleta[]> {
        const params = new HttpParams()
            .set('gruppo', gruppo)
            .set('genere', genere)
            .set('chiamata', chiamata.toString());
        return this.http.get<Atleta[]>(`${this.baseUrl}/lista-chiamate`, { params });
    }

    getClassifica(genere: string, gruppo: string, junior: boolean): Observable<AtletaClassifica[]> {
        const params = new HttpParams()
            .set('gruppo', gruppo)
            .set('genere', genere)
            .set('junior', junior.toString());
        return this.http.get<AtletaClassifica[]>(`${this.baseUrl}/classifica`, { params });
    }

    getClassificaAssoluto(genere: string, gruppo: string, junior: boolean): Observable<AtletaClassifica[]> {
        const params = new HttpParams()
            .set('gruppo', gruppo)
            .set('genere', genere)
            .set('junior', junior.toString());
        return this.http.get<AtletaClassifica[]>(`${this.baseUrl}/classifica-assoluto`, { params });
    }

    createAtleta(dto: CreateAtletaDto): Observable<Atleta> {
        return this.http.post<Atleta>(this.baseUrl, dto);
    }

    updateAtleta(id: string, dto: UpdateAtletaDto): Observable<Atleta> {
        return this.http.patch<Atleta>(`${this.baseUrl}/update/${id}`, dto);
    }

    updateValida(dto: UpdateValidaDto): Observable<Atleta> {
        return this.http.patch<Atleta>(`${this.baseUrl}/update-valida`, dto);
    }

    updateCarico(dto: UpdateCaricoDto): Observable<Atleta> {
        console.log("qui")
        return this.http.patch<Atleta>(`${this.baseUrl}/update-carico`, dto);
    }
}
