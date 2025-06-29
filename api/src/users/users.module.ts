import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserJsonRepository } from './repositories/user-json.repository';

@Module({
  providers: [
    UsersService,
    {
      provide: 'IUserRepository',
      useClass: UserJsonRepository,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {} 