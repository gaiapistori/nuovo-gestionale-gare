// frontend/src/app/core/websocket.service.ts
import { Injectable, isDevMode } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { Atleta } from '../model/atleta.entity';

@Injectable({
    providedIn: 'root'
})
export class WebsocketService {
    private socket: Socket;

    private getServerUrl(): string {
        // Se siamo già connessi a un server, usa quello stesso origin
        if (typeof window !== 'undefined') {
            const { protocol, hostname } = window.location;
            const port = isDevMode() ? '3000' : '8080';
            return `${protocol}//${hostname}:${port}`;
        }
        // Fallback per SSR o altri casi
        return 'http://localhost:3000';
    }

    // L'URL cambia a seconda dell'ambiente
    // DEV: punta direttamente al backend esposto (3000)
    // PROD: punta all'indirizzo Nginx (8080) che gestirà il proxying
    //private readonly URL = isDevMode()    ? 'http://localhost:3000' : 'http://localhost:8080';

    constructor() {
        this.socket = io(this.getServerUrl(), {
            path: '/socket.io/', // IMPORTANTE: deve combaciare con la location Nginx
            transports: ['websocket'], // Forziamo l'uso di WebSockets per stabilità
        });

        // Aggiungi questi log
        this.socket.on('connect', () => {
            console.log('✅ WebSocket connesso! ID:', this.socket.id);
        });

        this.socket.on('connect_error', (error) => {
            console.error('❌ Errore connessione WebSocket:', error);
        });

        this.socket.on('disconnect', (reason) => {
            console.log('🔌 WebSocket disconnesso:', reason);
        });
    }

    // obs VALIDITA
    public getValiditaAggiornata(): Observable<{ value: any, timestamp: Date }> {
        console.log('Subscribing to VALIDITÀ updates via WebSocket');
        return new Observable(observer => {
            this.socket.on('validitaAggiornata', (data: any) => {
                observer.next(data);
            });

            return () => {
                // Pulizia alla disiscrizione
                this.socket.off('validitaAggiornata');
            };
        });
    }

    // obs CARICO
    public getCaricoAggiornato(): Observable<{ value: any, timestamp: Date }> {
        console.log('Subscribing to CARICO updates via WebSocket');
        return new Observable(observer => {
            this.socket.on('caricoAggiornato', (data: any) => {
                observer.next(data);
            });

            return () => {
                // Pulizia alla disiscrizione
                this.socket.off('caricoAggiornato');
            };
        });
    }

    // obs GARA
    public getGaraCambiata(): Observable<{ value: any, timestamp: Date, garaFinita: boolean }> {
        console.log('Subscribing to GARA updates via WebSocket');
        return new Observable(observer => {
            this.socket.on('garaCambiata', (data: any) => {
                observer.next(data);
            });

            return () => {
                // Pulizia alla disiscrizione
                this.socket.off('garaCambiata');
            };
        });
    }
}