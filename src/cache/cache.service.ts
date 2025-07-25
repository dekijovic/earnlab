import {Inject, Injectable} from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class CacheService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}


  async setUserBalance(userId: string, balance: number) {
    await this.redis.set(`user:${userId}:balance`, balance);
  }

  async getUserBalance(userId: string): Promise<number | null> {
    const value = await this.redis.get(`user:${userId}:balance`);
    return value !== null ? +value : null;
  }
}
