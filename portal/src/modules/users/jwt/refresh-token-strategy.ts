import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: String(process.env.JWT_REFRESH_TOKEN),
        });
    }

    async validate(payload: any) {
        return {
            userId: payload.userId,
            email: payload.email,
            role: payload.role
        };
    }
}
