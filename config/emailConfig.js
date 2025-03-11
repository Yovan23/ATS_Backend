import nodemailer from 'nodemailer';
import { EMAIL_HOST, EMAIL_PASS, EMAIL_PORT, EMAIL_USER } from './config.js';



let transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: false,
    auth:{
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
})

export default transporter