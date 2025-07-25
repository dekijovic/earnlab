import { Module } from '@nestjs/common';
import { CreditsService } from './credits.service';
import { CreditsController } from './credits.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../users/entities/user.entity";
import {CreditTransaction} from "./entities/credit-transaction.entity";
import {UsersModule} from "../users/users.module";
import {QueueModule} from "../queue/queue.module";
import {EventsModule} from "../events/events.module";

@Module({
  controllers: [CreditsController],
  providers: [CreditsService],
  imports: [TypeOrmModule.forFeature([User, CreditTransaction]), UsersModule,
      QueueModule,
      EventsModule
  ],
  exports: [CreditsService]
})
export class CreditsModule {}
