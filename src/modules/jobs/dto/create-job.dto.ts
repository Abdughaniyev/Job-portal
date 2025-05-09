import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString, IsUUID } from "class-validator";
import { JobType } from "src/common/enums/jobType.enum";

export class CreateJobDto {
    @ApiProperty({
        description: 'Recruiter ID',
        example: '4f8a2e5c-3cb0-4f9f-a27f-2dcb1a0f8bd2'
    })
    @IsNotEmpty()
    @IsUUID()
    recruiterId: string;

    @ApiProperty({
        description: "Job title",
        example: "Math teacher"
    })
    @IsNotEmpty()
    @IsString()
    jobTitle: string;


    @ApiProperty({
        description: "Detailed job description",
        example: "Math teacher is needed. Part-time, from 9AM / 1PM, etc.."
    })
    @IsNotEmpty()
    @IsString()
    jobDescription: string;


    @ApiProperty({
        description: "Job location",
        example: "City or remote"
    })
    @IsString()
    @IsNotEmpty()
    jobLocation: string;

    @ApiProperty({
        description: "Full time or Part-time or Contract",
        example: " full-time"
    })
    @IsNotEmpty()
    @IsEnum(JobType)
    jobType: JobType;

    @ApiProperty({
        description: "Job salary",
        example: "$1200"
    })
    @IsNotEmpty()
    @IsString()
    salary: string;


    // recruiter id should come from jwt ParamsTokenFactory, and will get it from controller
}
