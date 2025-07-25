import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CreditsListener } from './listeners/credits.listener';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    CacheModule, // for updating Redis
  ],
  providers: [CreditsListener],
})
export class EventsModule {}
