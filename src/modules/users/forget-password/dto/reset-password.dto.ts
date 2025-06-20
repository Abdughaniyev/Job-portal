import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class ResetPasswordDto {
    @ApiProperty({
        description: "User email",
        example: "hitpitgym04@gmail.com"
    })
    @IsEmail()
    email: string
}