import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, } from '@nestjs/common';
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


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService,
    private readonly passwordService: PasswordService
  ) { }

  @Post('sign-up')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.usersService.signup(createUserDto);
  }

  @Post('log-in')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
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

  // GOOGLE AUTH 
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleAuth() {
    // Handled by guard
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(@Req() req) {
    return this.usersService.googleLogin(req.user);
  }

  // ADMIN: GET ALL USERS
  @Get()
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAll() {
    return this.usersService.findAll();
  }

  //USER: GET OWN PROFILE 
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
  

  // ADMIN: UPDATE USER

  @Patch(':id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  // ADMIN: DELETE USER 
  @Delete(':id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  
}





