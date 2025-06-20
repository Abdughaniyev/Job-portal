import { IsEmail, IsEnum, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { RoleEnum } from "src/common/enums/roleEnum";

export class CreateUserDto {

    @ApiProperty({
        description: "User full name",
        example: "John Doe"
    })
    @IsString()
    fullName: string;

    @ApiProperty({
        description: "User Email",
        example: "hitpitgym04@gmail.com"
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: "User password",
        example: "12345678"
    })
    @MinLength(8)
    @IsString()
    password: string;

    @ApiProperty({
        description: "User role",
        enum: RoleEnum,
        enumName: 'RoleEnum',
        example: RoleEnum.JOB_SEEKER
    })
    @IsEnum(RoleEnum)
    role: RoleEnum;



}
