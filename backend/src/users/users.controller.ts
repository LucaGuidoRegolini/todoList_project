import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UserMap } from './user.map';
import { Request } from 'express';
import { CreateUserRequest, UpdateUserRequest, UserWeb } from './dto/user.dto';
import {
  CreateUserDocumentation,
  UpdateUserDocumentation,
} from './decorators/user.decorators';
import { Authenticated } from '@src/auth/decorators/jwt.decorators';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @CreateUserDocumentation()
  @Post()
  async create(@Body() createUserDto: CreateUserRequest): Promise<UserWeb> {
    const user = await this.usersService.create(createUserDto);

    return UserMap.toWeb(user);
  }

  @UpdateUserDocumentation()
  @Authenticated()
  @Put()
  async update(
    @Req() req: Request,
    @Body() updateUserDto: UpdateUserRequest,
  ): Promise<UserWeb> {
    const user = await this.usersService.update(req.user.userId, updateUserDto);

    return UserMap.toWeb(user);
  }
}
