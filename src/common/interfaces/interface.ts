export interface IConfig {
    port: number;
    database: string;
    database_user: string;
    database_host: string;
    database_port: number;
    database_password: string;
    jwtAccessToken: string;
    jwtRefreshToken: string;
    clientID: string;
    clientSecret: string;
    callbackURL: string;
}