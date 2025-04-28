import * as dotenv from "dotenv";

dotenv.config();

export const databaseUrl = process.env.DATABASE_URL;
export const port = process.env.PORT;
export const jwtSecret = process.env.JWT_SECRET;
export const nodeEnv = process.env.NODE_ENV;
export const backendUrl = process.env.BACKEND_URL;
export const resetPasswordUrl = process.env.RESET_PASSWORD_URL;
export const frontendUrl = process.env.FRONTEND_URL;
