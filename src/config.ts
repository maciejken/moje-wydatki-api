import 'dotenv/config';

export const ROOT_DIR = String(process.env.ROOT_DIR);
export const NODE_ENV = String(process.env.NODE_ENV);
export const ALLOWED_ORIGIN = String(process.env.ALLOWED_ORIGIN);
export const HTTP_PORT = Number(3001);
export const API_PREFIX = String(process.env.API_PREFIX);
export const JWT_EXPIRES_IN = String(process.env.JWT_EXPIRES_IN);

export const DB_NAME = String(process.env.DB_NAME);
export const DB_HOST = String(process.env.DB_HOST);
export const DB_PORT = Number(process.env.DB_PORT);
export const DB_USER = String(process.env.DB_USER);
export const DB_PASSWORD = String(process.env.DB_PASSWORD);
export const DB_LOGGING = Boolean(process.env.DB_LOGGING);
export const DB_DIALECT = String(process.env.DB_DIALECT);
