import { Injectable, Inject, BadRequestException } from "@nestjs/common";
import { MailService } from "../nodemailer/nodemailer.service";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "@nestjs/cache-manager";
import { ResData } from "src/lib/resData";
@Injectable()
export class PasswordService {
    constructor(
        private readonly mailService: MailService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) { }

    async randomPassword(email: string) {
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        await this.cacheManager.set(`verify:${email}`, verifyCode);
        await this.mailService.sendMail(email, verifyCode);
        return new ResData('6-digit verification code has been sent successfully!', 201)

    }

    async verifyCode(email: string, code: string) {
        const storedCode = await this.cacheManager.get(`verify:${email}`);

        if (!storedCode) {
            throw new BadRequestException('Code expired or not found!');
        }

        if (storedCode !== code) {
            throw new BadRequestException('Invalid code!');
        }

        await this.cacheManager.del(`verify:${email}`);

        return new ResData('Code verified successfully!', 200);
    }
}

