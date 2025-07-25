import { IsUUID, IsPositive } from 'class-validator';

export class DepositDto {
    @IsUUID()
    userId: string;

    @IsPositive()
    amount: number;
}