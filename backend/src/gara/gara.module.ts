import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gara } from './gara.entity';
import { GaraService } from './gara.service';
import { GaraController } from './gara.controller';
import { AtletaModule } from 'src/atleta/atleta.module';
import { UpdatesModule } from 'src/updates/update.module';

@Module({
    imports: [TypeOrmModule.forFeature([Gara]), forwardRef(() => AtletaModule), UpdatesModule],
    providers: [GaraService],
    controllers: [GaraController],
    exports: [GaraService],
})
export class GaraModule { }
