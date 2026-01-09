import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Atleta } from './atleta.entity';
import { AtletaService } from './atleta.service';
import { AtletaController } from './atleta.controller';
import { GaraModule } from '../gara/gara.module';
import { UpdatesModule } from 'src/updates/update.module';

@Module({
    imports: [TypeOrmModule.forFeature([Atleta]), GaraModule, UpdatesModule],
    providers: [AtletaService],
    controllers: [AtletaController],
    exports: [AtletaService],
})
export class AtletaModule { }
