import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import {ApiTags} from "@nestjs/swagger";

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService

  ) {}

  @Post()
  async create(@Body() dto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(dto);
  }

  @Get(':id')
  async get(@Param('id') id: string): Promise<User> {
    return this.usersService.getUserById(id);
  }
}
