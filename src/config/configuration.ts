export default () => ({
  port: parseInt(process.env.PORT ?? '4000', 10),
  mongo: {
    uri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/skv_hr',
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET ?? 'access_secret_dev',
    refreshSecret: process.env.JWT_REFRESH_SECRET ?? 'refresh_secret_dev',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
  },
  cors: {
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  },
});
