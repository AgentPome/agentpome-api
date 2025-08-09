export interface Config {
    port: number,
    nodeEnv: string;
    databaseUrl: string;
    resetTokenExpiryMinutes: number;
    jwtSecret: string;
    refreshTokenSecret: string;
}