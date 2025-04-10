require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const expRouter = require("./routes/expenseRouter");
const grpRouter = require("./routes/grpRouter");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options("*", cors());

const { PORT } = process.env;

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/grp", grpRouter);
app.use("/exp", expRouter);

app.get("/", (req, res) => {
  res.json("Welcome to our app Fair Share!");
});

app.use((err, req, res, next) => {
  console.error(err.message);
  console.error(err.stack);
  res.send("Something broke in server!");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
