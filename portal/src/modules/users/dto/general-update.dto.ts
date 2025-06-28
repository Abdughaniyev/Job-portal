import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { VerifyDto } from '../forget-password/dto/verify-code.dto';
import { ResetPasswordDto } from '../forget-password/dto/reset-password.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
export class UpdateVerifyDto extends PartialType(VerifyDto){}
export class UpdatePasswordDto extends PartialType(ResetPasswordDto){}