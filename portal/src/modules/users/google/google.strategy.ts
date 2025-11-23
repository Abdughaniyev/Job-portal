import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { config } from 'src/common/config/config';


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {

    constructor() {
        super({

            clientID: config.clientID,
            clientSecret: config.clientSecret,
            callbackURL: config.callbackURL,
            // callbackURL: config.callbackURL, // for local host
            scope: ['email', 'profile'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
        const { name, emails } = profile;
        const user = {
            fullName: name.givenName + ' ' + name.familyName,
            email: emails[0].value,
            provider: 'google',
        };
        done(null, user);
    }
}


