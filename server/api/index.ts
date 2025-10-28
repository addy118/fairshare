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
const { PORT } = process.env;

const allowedOrigins = [
  "https://fairshare.adityakirti.tech",
  "https://fairsharee.netlify.app",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:8080",
  "http://localhost:8081",
];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    exposedHeaders: ["Content-Disposition"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options("*", cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cookieParser());
app.use(clerkMiddleware());

app.use("/clerk", clerkRouter);
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

export default app;
