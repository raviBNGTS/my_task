export const env= {
    PORT:Number(process.env.PORT ??3000),
    DB_URL:process.env.DB_URL,
    JWT_SECRET:process.env.JWT_SECRET,
    REDIS_URL:process.env.REDIS_URL,
    COOKIE_NAME:process.env.COOKIE_NAME ??"auth_token",
    // APP_ORIGIN:process.env.APP_ORIGIN
}