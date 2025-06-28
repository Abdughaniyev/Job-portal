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


    @IsString()
    @ApiProperty({
        description: "Cover letter message in English",
        example: "I'm excited to apply for the Frontend Developer role. With 2 years of experience in React and a passion for clean UI, I believe I can contribute effectively to your team."
    })
    @IsOptional()
    coverLetterEn: string;

    @IsString()
    @ApiProperty({
        description: "Сопроводительное письмо на русском языке",
        example: "Я рад подать заявку на должность Frontend-разработчика. y меня 2 года опыта c React и страсть к чистому интерфейсу, я уверен, что смогу внести вклад в вашу команду."
    })
    @IsOptional()
    coverLetterRu: string;

    @IsString()
    @ApiProperty({
        description: "Qo'shimcha xat (cover letter) xabari o'zbek tilida",
        example: "Frontend dasturchi lavozimiga ariza topshirishdan mamnunman. React'da 2 yillik tajribam va toza UI'ga bo'lgan ishtiyoqim bilan jamoangizga foydali hissa qo'sha olaman, deb o'ylayman."
    })
    @IsOptional()
    coverLetterUz: string;


}

