import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';

@Module({
  providers: [
    UsersService,
    {
      provide: 'IUsersRepository',
      useClass: UsersRepository,
    },
  ],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}