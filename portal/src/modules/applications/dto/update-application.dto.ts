import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { ApplicationStatusEnum } from "src/common/enums/application-status";
import { CreateApplicationDto } from "./create-application.dto";

export class UpdateApplicationDto extends PartialType(CreateApplicationDto) {
    @ApiProperty({
        enum: ApplicationStatusEnum,
        description: "Applications status"
    })
    @IsEnum(ApplicationStatusEnum)
    @IsOptional()
    status: ApplicationStatusEnum;

    @ApiProperty({
        description: "Optional recruiter feedback",
        required: false
    })
    @IsOptional()
    feedback?: string;
}
