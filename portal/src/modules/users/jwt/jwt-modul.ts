import { Module } from "@nestjs/common";
import { config } from "src/common/config/config";
import { JwtStrategy } from "./jwt-strategy";
import { JwtModule } from "@nestjs/jwt";
import { RefreshTokenStrategy } from "./refresh-token-strategy";
import { AuthService } from "./auth-service";


@Module({
    imports: [
        JwtModule.register({
            secret: config.jwtAccessToken,
        }),
    ],
    providers: [JwtStrategy,
        RefreshTokenStrategy,
        AuthService,
    ],
    exports: [],
})

export class AuthModule { }
