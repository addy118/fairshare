require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userRouter = require("./routes/user.routes");
const expRouter = require("./routes/expense.routes");
const grpRouter = require("./routes/grp.routes");
const { clerkMiddleware } = require("@clerk/express");
const clerkRouter = require("./routes/clerk.routes");
const app = express();
app.use(clerkMiddleware());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = [
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

app.get("/", (req, res) => {
  res.json("Welcome to our app Fair Share! You are an unauthenticated user!");
});

app.use((err, req, res, next) => {
  console.error(err.message);
  console.error(err.stack);
  res.send("Something broke in server!");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
