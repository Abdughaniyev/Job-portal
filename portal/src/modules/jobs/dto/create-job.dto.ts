import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { JobType } from "src/common/enums/jobType.enum";

export class CreateJobDto {

    @ApiProperty({ description: "Job title in English", example: "Math teacher" })
    @IsOptional()
    @IsString()
    titleEn?: string;

    @ApiProperty({ description: "Job title in Russian", example: "Учитель математики" })
    @IsOptional()
    @IsString()
    titleRu?: string;

    @ApiProperty({ description: "Job title in Uzbek", example: "Matematika o'qituvchisi" })
    @IsOptional()
    @IsString()
    titleUz?: string;

    @ApiProperty({ description: "Job description in English" })
    @IsOptional()
    @IsString()
    descriptionEn?: string;

    @ApiProperty({ description: "Job description in Russian" })
    @IsOptional()
    @IsString()
    descriptionRu?: string;

    @ApiProperty({ description: "Job description in Uzbek" })
    @IsOptional()
    @IsString()
    descriptionUz?: string;

    @ApiProperty({ description: "Requirements in English" })
    @IsOptional()
    @IsString()
    requirementsEn?: string;

    @ApiProperty({ description: "Requirements in Russian" })
    @IsOptional()
    @IsString()
    requirementsRu?: string;

    @ApiProperty({ description: "Requirements in Uzbek" })
    @IsOptional()
    @IsString()
    requirementsUz?: string;

    @ApiProperty({ description: "Location in English" })
    @IsOptional()
    @IsString()
    locationEn?: string;

    @ApiProperty({ description: "Location in Russian" })
    @IsOptional()
    @IsString()
    locationRu?: string;

    @ApiProperty({ description: "Location in Uzbek" })
    @IsOptional()
    @IsString()
    locationUz?: string;


    @ApiProperty({ description: "Salary" })
    @IsOptional()
    @IsString()
    salary?: string;

    @ApiProperty({
        description: "Job type (full-time, part-time, contract)",
        example: "full-time",
    })
    @IsNotEmpty()
    @IsEnum(JobType)
    jobType: JobType;

    @ApiProperty({
        description: "Job category (example: IT, Finance)",
        example: "IT",
    })
    @IsNotEmpty()
    @IsString()
    jobCategory: string;

    @ApiProperty({
        description: "Company name",
        example: "EPAM",
    })
    @IsNotEmpty()
    @IsString()
    companyName: string;
}
