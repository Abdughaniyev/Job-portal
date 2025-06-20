import { Module } from "@nestjs/common";
import { config } from "src/common/config/config";
import { JwtStrategy } from "./jwt-strategy";
import { JwtModule } from "@nestjs/jwt";


@Module({
    imports: [
        JwtModule.register({
            secret: config.jwtAccessToken,
        }),
    ],
    providers: [JwtStrategy],
    exports: [],
})

export class AuthModule { }
