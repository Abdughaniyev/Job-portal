import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsString, IsUUID } from "class-validator";

export class CreateApplicationDto {
    @ApiProperty({
        description: "ID of the job being applied to"
    })
    @Type(() => String)
    @IsUUID()
    jobId: string;

    @ApiProperty({
        description: "Applicant ID"
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

