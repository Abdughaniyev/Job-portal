import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/general-update.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from './jwt/auth-guard';
import { RolesGuard } from './roles/roles.guard';
import { Roles } from './roles/roles.decorator';
import { GoogleAuthGuard } from './google/google-auth.guard';
import { PasswordService } from './forget-password/forget-password.service';
import { VerifyDto } from './forget-password/dto/verify-code.dto';
import { ResetPasswordDto } from './forget-password/dto/reset-password.dto';
import { JwtRefreshAuthGuard } from './jwt/refresh-guard';
import { RequestWithUser } from './jwt/request-with-user.interface';
import { Request } from 'express';
import { PaginationDto } from 'src/lib/paginationGeneral.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { LogoutDto } from './dto/logout.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
  ) { }

  @Post('sign-up')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.usersService.signup(createUserDto);
  }

  @Post('log-in')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refreshToken: { type: 'string', example: 'your-refresh-token-here' },
      },
      required: ['refreshToken'],
    },
  })
  @Post('log-out')
  logout(@Req() req: RequestWithUser, @Body() body: LogoutDto) {
    console.log('req.user:', req.user);
    const user = req.user as { userId: string };

    const userId = user.userId;
    const refreshTokenFromClient = req.body.refreshToken;
    return this.usersService.logout(userId, refreshTokenFromClient);
  }


  // PASSWORD RESET FLOW

  @Post('reset-password')
  resetPassword(@Body() body: ResetPasswordDto) {
    return this.passwordService.randomPassword(body.email);
  }

  @Post('verify-password')
  verifyCode(@Body() verifyDto: VerifyDto) {
    return this.passwordService.verifyCode(verifyDto.email, verifyDto.resetPassword);
  }
  @ApiBearerAuth('access-token')
  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  refresh(@Req() req: RequestWithUser) {
    const user = req.user;
    const newAccessToken = this.usersService.generateRefreshToken(user);
    return { accessToken: newAccessToken };
  }

  // GOOGLE AUTH 

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleAuth() { }


  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(@Req() req) {
    return this.usersService.googleLogin(req.user);
  }

  // ADMIN: GET ALL USERS
  @ApiBearerAuth('access-token')
  @Get()
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAll(@Query() pagination: PaginationDto) {
    return this.usersService.findAll(pagination);
  }

  // USER: GET OWN PROFILE 
  @ApiBearerAuth('access-token')
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  // ADMIN: UPDATE USER
  @ApiBearerAuth('access-token')
  @Patch(':id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  // ADMIN: DELETE USER 
  @ApiBearerAuth('access-token')
  @Delete(':id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}