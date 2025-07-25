import {
    IsNotEmpty, IsPositive, IsUUID,
} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class TransferDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    fromUserId: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    toUserId: string;


    @ApiProperty()
    @IsNotEmpty()
    @IsPositive()
    amount: number;

}
