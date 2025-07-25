import { Module } from '@nestjs/common';
import { CreditsService } from './credits.service';
import { CreditsController } from './credits.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../users/entities/user.entity";
import {CreditTransaction} from "./entities/credit-transaction.entity";

@Module({
  controllers: [CreditsController],
  providers: [CreditsService],
  imports: [TypeOrmModule.forFeature([User, CreditTransaction])],
})
export class CreditsModule {}
