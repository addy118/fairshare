import { config } from "dotenv";
config();
import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.routes";
import expRouter from "./routes/expense.routes";
import grpRouter from "./routes/grp.routes";
import { clerkMiddleware } from "@clerk/express";
import clerkRouter from "./routes/clerk.routes";

const app = express();
app.use(clerkMiddleware());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = [
  "https://fairshare.adityakirti.tech",
  "https://fairsharee.netlify.app",
  "http://localhost:5173",
  "http://localhost:5174",
];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options("*", cors());
const { PORT } = process.env;

app.use("/clerk", clerkRouter);

app.use(express.json());
app.use("/user", userRouter);
app.use("/grp", grpRouter);
app.use("/exp", expRouter);

app.get("/", (req: Request, res: Response) => {
  res.json("Welcome to our app Fairshare! You are an unauthenticated user!");
});

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(error.message);
  console.error(error.stack);
  res.send("Something broke in server!");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
