// backend/src/updates/updates.gateway.ts
import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    // Configura il CORS per accettare connessioni sia da dev che da prod
    cors: {
        // localhost:4200 (sviluppo) e localhost:8080 (produzione tramite Nginx)
        origin: ['http://localhost:4200', 'http://localhost:8080'],
        credentials: true,
    },
})
export class UpdatesGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server; // L'istanza del server Socket.io per l'emissione

    public sendUpdateValidita(newValue: any): void {
        console.log('Emettendo aggiornamento VALIDITÀ via WebSocket:', newValue);
        this.server.emit('validitaAggiornata', { value: newValue, timestamp: new Date() });
    }

    public sendUpdateCarico(newValue: any): void {
        console.log('Emettendo aggiornamento CARICO via WebSocket:', newValue);
        this.server.emit('caricoAggiornato', { value: newValue, timestamp: new Date() });
    }

    public sendCambioGara(newValue: any, garaFinita: boolean): void {
        console.log('Emettendo aggiornamento GARA via WebSocket:', newValue);
        this.server.emit('garaCambiata', { value: newValue, timestamp: new Date(), garaFinita: garaFinita });
    }

    handleConnection(client: Socket) {
        // console.log(`Client connesso per WS: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        // console.log(`Client disconnesso per WS: ${client.id}`);
    }
}