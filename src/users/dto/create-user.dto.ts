import { IsEmail, IsNotEmpty } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class CreateUserDto {

    @ApiProperty({description:'Email of the user', example: 'test@mail.com'})
    @IsEmail()
    email: string;
}