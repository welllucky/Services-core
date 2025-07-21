import { Roles } from "@/typing";

export const APP_URL = `http://localhost:${process.env.PORT}`;
export const TESTER_EMAIL = "well2@l3.com";
export const TESTER_PASSWORD = "L3@123456hexo";
export const ADMIN_EMAIL = "well2@l3.com";
export const ADMIN_PASSWORD = "L3@123456hexo";
export const AUTH_SECRET_MOCK = "X1a9/zHNQx4R8kC2W3Yr7LmP5ZvAqBt9sFjK8dNaQWxe=";
export const ALLOWED_BACKOFFICE_ROLES = ["admin", "manager"] as Roles[];
export const UNIT_DAYS_TO_EXPIRE_THE_TOKEN = 3;
export const TIME_TO_EXPIRE_THE_TOKEN = UNIT_DAYS_TO_EXPIRE_THE_TOKEN * 24 * 60 * 60 * 1000;