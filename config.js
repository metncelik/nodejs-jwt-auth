import fs from 'fs';

export const PORT = parseInt(process.env.PORT || 5000);
export const ACCESS_PRIVATE_KEY = fs.readFileSync("./private_key.pem", "ascii");
export const ACCESS_PUBLIC_KEY = fs.readFileSync("./public_key.pem", "ascii");
export const REFRESH_SECRET = process.env.REFRESH_SECRET;
export const REFRESH_AGE = parseInt(process.env.REFRESH_AGE);
export const ACCESS_AGE = parseInt(process.env.ACCESS_AGE);