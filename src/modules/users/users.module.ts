import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { GoogleStrategy } from './google/google.strategy';
import { AuthService } from './jwt/auth-service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule
  ],
  controllers: [UsersController],
  providers: [UsersService, GoogleStrategy, AuthService],
})
export class UsersModule { }
