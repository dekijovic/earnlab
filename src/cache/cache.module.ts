import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import Redis from 'ioredis';

@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new Redis({
          host: process.env.REDIS_HOST || 'localhost',
          port: +(process.env.REDIS_PORT || 6379),
        });
      },
    },
    CacheService,
  ],
  exports: [CacheService],
})
export class CacheModule {}
