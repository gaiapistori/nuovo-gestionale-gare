import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AtletaModule } from './atleta/atleta.module';
import { GaraModule } from './gara/gara.module';
import { UpdatesGateway } from './updates/updates.gateway';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST || 'postgres',
            port: 5432,
            username: 'postgres',
            password: 'postgres',
            database: 'gestionale',
            autoLoadEntities: true,
            synchronize: true, // true cancella i dati perchè fa migrations automatiche
        }),
        AtletaModule,
        GaraModule,
    ],
    providers: [UpdatesGateway],
})
export class AppModule { }
