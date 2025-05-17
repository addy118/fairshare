const { Router } = require("express");
const {
  postSignup,
  postLogin,
  getToken,
  refresh,
  postLogout,
} = require("../controllers/authController");
const { validateReq } = require("../config/validation/req");
const { validateSignup, validateLogin } = require("../config/validation/user");
const authRouter = Router();

authRouter.get("/token", getToken);
authRouter.get("/refresh", refresh);

authRouter.post("/signup", [validateSignup, validateReq, postSignup]);

authRouter.post("/login", [validateLogin, validateReq, postLogin]);
authRouter.post("/logout", postLogout);

authRouter.use((err, req, res, next) => {
  console.error(err.message);
  console.error(err.stack);
  res.send("Something broke in auth routes!");
});

module.exports = authRouter;
