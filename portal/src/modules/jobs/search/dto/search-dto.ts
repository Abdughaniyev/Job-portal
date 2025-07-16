import { IsIn, IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LanguageEnum } from 'src/common/enums/language.enum';

export class SearchJobDto {
    @ApiProperty({ description: 'Job title to search for' })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiPropertyOptional({ description: 'Salary filter (optional)' })
    @IsOptional()
    @IsString()
    salary?: string;

    @ApiPropertyOptional({ description: 'Job category filter (optional)' })
    @IsOptional()
    @IsString()
    category?: string;

    @ApiPropertyOptional({
        description: 'Language to search in',
        enum: LanguageEnum,
        default: LanguageEnum.EN,
    })
    @IsOptional()
    @IsIn(Object.values(LanguageEnum))
    lang?: LanguageEnum;
}
