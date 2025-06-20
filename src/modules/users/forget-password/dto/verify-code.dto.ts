import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class VerifyDto {
    
     @ApiProperty({
        description: "User email",
        example: "hitpitgym04@gmail.com"
    })
    @IsEmail()
    email:string
    
    @ApiProperty({
        description: "User reset password",
        example: "123456"
    })
    @MinLength(6)
    @IsString()
    resetPassword: string;

   
}