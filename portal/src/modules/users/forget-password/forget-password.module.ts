import { Module } from "@nestjs/common";
import { PasswordService } from "./forget-password.service";
import { MailModule } from "../nodemailer/nodemailer.module";
import { CacheModule } from "@nestjs/cache-manager";
@Module({
    imports:[
        CacheModule.register(),
        MailModule,
    ],  
    providers: [PasswordService],
    exports: [PasswordService]
})

export class PasswordModule { }