import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from './jwt/auth-guard';
import { RolesGuard } from './roles/roles.guard';
import { Roles } from './roles/roles.decorator';
import { GoogleAuthGuard } from './google/google-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  // Anyone can sign up
  @Post('sign-up')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.usersService.signup(createUserDto);
  }

  // Anyone can log in
  @Post('log-in')
  login(@Body() createLoginUserDto: LoginUserDto) {
    return this.usersService.login(createLoginUserDto);
  }

  

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleAuth() {
    // Redirects to Google
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(@Req() req) {
    return this.usersService.googleLogin(req.user);
  }



  // Only admin can view all users
  @Get()
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAll() {
    return this.usersService.findAll();
  }

  // Any authenticated user can view their own data
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  // Only admin can update user details
  @Roles('admin')
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  // Only admin can delete a user
  @Roles('admin')
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}





