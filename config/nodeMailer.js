const nodemailer = require("nodemailer");
require("dotenv").config({ path: "../.env" });
const { APP_PASSWORD } = process.env;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "addyyy118@gmail.com",
    pass: APP_PASSWORD,
  },
});

module.exports = { transporter };
