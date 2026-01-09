// backend/src/updates/updates.module.ts

import { Module } from '@nestjs/common';
import { UpdatesGateway } from './updates.gateway';

@Module({
    providers: [UpdatesGateway],
    exports: [UpdatesGateway],
})
export class UpdatesModule { }