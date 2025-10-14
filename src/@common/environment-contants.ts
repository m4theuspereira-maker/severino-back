import { resolve } from 'path';
import { config } from 'dotenv';

config({ path: resolve(__dirname, '../../.env') });

export const PORT = process.env.PORT || 3000;
export const APP_SECRET = process.env.APP_SECRET;
export const ZOLDPAY_API_KEY = process.env.ZOLDPAY_API_KEY;
export const ZOLDPAY_PAID_STATUS = 'PAID';
export const ENCRYPTION_SECRET_KEY = process.env.ENCRYPTION_SECRET_KEY;
export const API_KEY = process.env.API_KEY;
export const NODE_ENV = process.env.NODE_ENV;
export const REDIRECT_URL = process.env.REDIRECT_URL;
export const AGILIZE_PAY_URL = process.env.AGILIZE_PAY_URL
export const AGILIZE_PAY_CLIENT_ID = process.env.AGILIZE_PAY_CLIENT_ID
export const AGILIZE_PAY_POSTBACK = process.env.AGILIZE_PAY_POSTBACK