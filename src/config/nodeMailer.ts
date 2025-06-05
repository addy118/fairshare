import nodemailer, { Transporter } from "nodemailer";
import { config } from "dotenv";
config();
const { APP_PASSWORD } = process.env;

const transporter: Transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "addyyy118@gmail.com",
    pass: APP_PASSWORD,
  },
});

export { transporter };
