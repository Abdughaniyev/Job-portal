import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UseInterceptors, UploadedFile, } from '@nestjs/common';
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
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer'
import { extname } from 'path';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,

  ) { }


  @Roles('jobseeker')
  @UseGuards(JwtAuthGuard)
  @Post('file-upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/resumes',
        filename: (req, file, cb) => {
          const uniqueName = Date.now() + '-' + Math.floor(Math.random() * 1000000);
          const fileExtension = extname(file.originalname);
          cb(null, uniqueName + fileExtension);
        }
      }),
      fileFilter: (req, file, cb) => {
        const isPdf = file.mimetype === 'application/pdf';
        cb(isPdf ? null : new Error('Only pdf files are allowed!'), isPdf);
      },
      limits: { fileSize: 5 * 1024 * 1024 }
    })
  )


  async uploadResume(@UploadedFile() file: Express.Multer.File) {
    const fileUrl = `http://localhost:3000/uploads/resumes/${file.filename}`
    return this.usersService.saveResumePath(fileUrl);
  }



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





