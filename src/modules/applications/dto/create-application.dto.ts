import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {  IsOptional, IsString, IsUUID } from "class-validator";

export class CreateApplicationDto {
    @ApiProperty({
        description: "ID of the job being applied to",
        example: "f81d4fae-7dec-11d0-a765-00a0c91e6bf6"
    })
    @Type(() => String)
    @IsUUID()
    jobId: string;

    @ApiProperty({
        description: "Applicant ID",
        example: "f81d4fae-7dec-11d0-a765-00a0c91e6bf6"
    })
    @Type(() => String)
    @IsUUID()
    applicantId: string;


    @ApiProperty({
        description: "Optional cover letter message",
        required: false,
        example: "I`m excited to apply for the Frontend Developer role. With 2 years of experience in React and a passion for clean UI, I believe I can contribute effectively to your team."
    })
    @IsOptional()
    @IsString()
    coverLetter?: string;


}


// 1. finish application dto, and check UpdateApplicationDto
// 2. finish entites
// 3. all controllers
// Use: how to handle PDF file uploads in NestJS using @UseInterceptors(FileInterceptor(...)) with Multer, which is built-in to NestJS for handling multipart/form-data (i.e. file uploads).
// 

