import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CacheService } from '../../cache/cache.service';

@Injectable()
export class CreditsListener {
    private readonly logger = new Logger(CreditsListener.name);

    constructor(private readonly cacheService: CacheService) {}

    @OnEvent('credits.deposited')
    async handleCreditsDeposited(payload: { userId: string; newBalance: number }) {
        this.logger.log(`credits.deposited:`, payload);
        await this.cacheService.setUserBalance(payload.userId, payload.newBalance);
    }

    @OnEvent('credits.transferred')
    async handleCreditsTransferred(payload: {
        fromUserId: string;
        toUserId: string;
        fromNewBalance: number;
        toNewBalance: number;
    }) {
        this.logger.log(`credits.transferred:`, payload);
        await this.cacheService.setUserBalance(payload.fromUserId, payload.fromNewBalance);
        await this.cacheService.setUserBalance(payload.toUserId, payload.toNewBalance);
    }
}
