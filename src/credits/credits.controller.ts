import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreditsService } from './credits.service';
import { CreateCreditDto } from './dto/create-credit.dto';
import { UpdateCreditDto } from './dto/update-credit.dto';
import {DepositDto} from "./dto/deposit.dto";
import {TransferDto} from "./dto/transfer.dto";

@Controller('credits')
export class CreditsController {
  constructor(private readonly creditsService: CreditsService) {}


  @Post('/deposit')
  createDeposit(@Body() dto: DepositDto) {
    return this.creditsService.depositCredits(dto);
    //- Adds credits to user's balance.
    // - Emits an event credits.deposited.
  }

  @Post('transfer')
  async transfer(@Body() dto: TransferDto) {
    await this.creditsService.transferCredits(dto);
    return { message: 'Transfer successful' };
  }


}
