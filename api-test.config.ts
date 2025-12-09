// @ts-ignore
import dotenv from 'dotenv';
// @ts-ignore
import path from 'path';

dotenv.config({path: path.resolve(__dirname, '.env')});

const processENV = process.env.TEST_ENV;
const env = processENV || 'dev';
console.log(`Running test in ${env} environment`);

const config = {
    apiUrl: "http://localhost:8000/api",
    userEmail: process.env.EMAIL || "",
    userPassword: process.env.PASSWORD || ""
};

if (env === 'qa') {
    config.userEmail = process.env.EMAIL || "";
    config.userPassword = process.env.PASSWORD || ""
}

export {config}

