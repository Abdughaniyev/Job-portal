import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateJobDto } from './create-job.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { JobType } from 'src/common/enums/jobType.enum';

export class UpdateJobDto extends PartialType(CreateJobDto) {
    @ApiProperty({ description: "Job type", example: "part-time" })
    @IsOptional()
    @IsEnum(JobType)
    jobType?: JobType;
}
