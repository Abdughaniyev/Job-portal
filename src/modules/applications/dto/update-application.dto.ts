import { PartialType } from '@nestjs/mapped-types';
import { CreateApplicationDto } from './create-application.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { ApplicationStatusEnum } from 'src/common/enums/application-status';



export class UpdateApplicationDto extends PartialType(CreateApplicationDto) {
    @ApiProperty({
        enum: ApplicationStatusEnum,
        description: "Applications status"
    })
    @IsEnum(ApplicationStatusEnum)
    status: ApplicationStatusEnum;


    @ApiProperty({
        description: "Optional recruiter feedback",
        required: false
    })
    @IsOptional()
    feedback?: string;
}
