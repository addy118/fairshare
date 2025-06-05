"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const expense_routes_1 = __importDefault(require("./routes/expense.routes"));
const grp_routes_1 = __importDefault(require("./routes/grp.routes"));
const express_2 = require("@clerk/express");
const clerk_routes_1 = __importDefault(require("./routes/clerk.routes"));
const app = (0, express_1.default)();
app.use((0, express_2.clerkMiddleware)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
const allowedOrigins = [
    "https://fairshare.adityakirti.tech",
    "https://fairsharee.netlify.app",
    "http://localhost:5173",
    "http://localhost:5174",
];
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.options("*", (0, cors_1.default)());
const { PORT } = process.env;
app.use("/clerk", clerk_routes_1.default);
app.use(express_1.default.json());
app.use("/user", user_routes_1.default);
app.use("/grp", grp_routes_1.default);
app.use("/exp", expense_routes_1.default);
app.get("/", (req, res) => {
    res.json("Welcome to our app Fairshare! You are an unauthenticated user!");
});
app.use((error, req, res, next) => {
    console.error(error.message);
    console.error(error.stack);
    res.send("Something broke in server!");
});
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
//# sourceMappingURL=server.js.map