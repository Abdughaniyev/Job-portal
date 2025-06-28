import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { GoogleStrategy } from './google/google.strategy';
import { AuthService } from './jwt/auth-service';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from 'src/modules/users/nodemailer/nodemailer.module';
import { MailService } from 'src/modules/users/nodemailer/nodemailer.service';
import { PasswordModule } from './forget-password/forget-password.module';
import { SearchModule } from '../jobs/search/search.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule,
    MailModule,
    PasswordModule,
    SearchModule,

  ],

  controllers: [UsersController],
  providers: [
    UsersService,
    GoogleStrategy,
    AuthService,
    MailService,

  ],

  exports: [UsersService]
})
export class UsersModule { }


