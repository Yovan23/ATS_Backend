import dotenv from "dotenv";
dotenv.config();

export const DATABASE_URL = process.env.DATABASE_URL;
export const BASE_URL = process.env.BASE_URL;
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
export const JWT_SECRET_KEY2 = process.env.JWT_SECRET_KEY2;

