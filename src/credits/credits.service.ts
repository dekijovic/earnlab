import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { CreditTransaction } from './entities/credit-transaction.entity';
import { Repository, DataSource } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {DepositDto} from "./dto/deposit.dto";
import {TransferDto} from "./dto/transfer.dto";
import {InjectQueue} from "@nestjs/bull";
import {Queue} from "bull";

@Injectable()
export class CreditsService {
  constructor(
      @InjectRepository(User)
      private readonly userRepo: Repository<User>,
      @InjectQueue('audit') private readonly auditQueue: Queue,

      @InjectRepository(CreditTransaction)
      private readonly creditTxRepo: Repository<CreditTransaction>,

      private readonly dataSource: DataSource,
      private readonly eventEmitter: EventEmitter2,
  ) {}

  async depositCredits(dto: DepositDto): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const user: User|null = await manager.findOne(User, { where: { id: dto.userId } });
      if (!user) throw new NotFoundException('User not found');

      user.credits += dto.amount;
      await manager.save(user);

      const tx = this.creditTxRepo.create({
        fromUserId: null,
        toUserId: dto.userId,
        amount: dto.amount,
      });
      await manager.save(tx);

      this.eventEmitter.emit('credits.deposited', {
        userId: dto.userId,
        amount: dto.amount,
        newBalance: user.credits,
      });
    });
  }


  async transferCredits(dto: TransferDto): Promise<void> {
    if (dto.fromUserId === dto.toUserId) {
      throw new BadRequestException('Cannot transfer credits to the same user');
    }

    await this.dataSource.transaction(async (manager) => {
      const fromUser: User|null = await manager.findOne(User, {
        where: { id: dto.fromUserId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!fromUser) throw new NotFoundException('Sender user not found');

      const toUser: User|null = await manager.findOne(User, {
        where: { id: dto.toUserId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!toUser) throw new NotFoundException('Recipient user not found');

      if (fromUser.credits < dto.amount) {
        throw new BadRequestException('Insufficient credits for transfer');
      }

      fromUser.credits -= dto.amount;
      toUser.credits += dto.amount;

      const tx = this.creditTxRepo.create({
        fromUserId: dto.fromUserId,
        toUserId: dto.toUserId,
        amount: dto.amount,
      });
      await manager.save(tx);
      await manager.save(fromUser);
      await manager.save(toUser);

      this.eventEmitter.emit('credits.transferred', {
        fromUserId: dto.fromUserId,
        toUserId: dto.toUserId,
        amount: dto.amount,
        newBalanceFrom: fromUser.credits,
        newBalanceTo: toUser.credits,
      });
    });

    await this.auditQueue.add('credit-transfer', {
      fromUserId: dto.fromUserId,
      toUserId: dto.toUserId,
      amount: dto.amount,
      timestamp: new Date().toISOString(),
    });
  }
}
