import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginUserDto {
    @ApiProperty({
        description: "User login by email",
        example: "hitpitgym04@gmail.com"
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;


    @ApiProperty({
        description: "User's login password",
        example: "12345678"
    })
    @IsNotEmpty()
    password: string;

    
}