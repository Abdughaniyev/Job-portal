
import * as dotenv from 'dotenv'
dotenv.config()
import { IConfig } from '../interfaces/interface'
export const config: IConfig = {
    port: Number(process.env.PORT),
    database: process.env.DATABASE || '',
    database_user: process.env.DATABASE_USER || '',
    database_host: process.env.DATABASE_HOST || 'localhost',
    database_password: String(process.env.DATABASE_PASSWORD),
    database_port: Number(process.env.DATABASE_PORT) || 5432,

    jwtAccessToken: process.env.JWT_ACCESS_TOKEN || '',
    jwtRefreshToken: process.env.JWT_REFRESH_TOKEN || '',

    frontendURL: String(process.env.FRONTEND_URL) || 'http://localhost:5173' || 'https://frelanser-versel-eol5.vercel.app',

    // Google related part
    clientID: String(process.env.GOOGLE_CLIENT_ID) || '',
    clientSecret: String(process.env.GOOGLE_CLIENT_SECRET) || '',
    callbackURL: String(process.env.GOOGLE_CALLBACK_URL) || '',

    smtpPort: Number(process.env.SMTP_PORT),
    smtpHost: String(process.env.SMTP_HOST) || '',
    smtpUser: String(process.env.SMTP_USER) || '',
    smtpPassword: String(process.env.SMTP_PASSWORD) || '',
    ipAddress: String(process.env.IP_ADDRESS)
};
