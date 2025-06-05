"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const { APP_PASSWORD } = process.env;
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: "addyyy118@gmail.com",
        pass: APP_PASSWORD,
    },
});
exports.transporter = transporter;
//# sourceMappingURL=nodeMailer.js.map