const { Router } = require("express");
const { requireAuth } = require("@clerk/express");
const {
  getUser,
  putUserName,
  putUserEmail,
  putUserPass,
  delUser,
  testProtected,
  getUserBal,
  putUserUserName,
  putUserPhone,
  getUserInfo,
  getUserGroups,
} = require("../controllers/user.controller");
const { validateReq } = require("../config/validation/req");
const {
  validateName,
  validateEmail,
  validatePass,
} = require("../config/validation/user");
const userRouter = Router();

userRouter.get("/:userId", getUser);

// protect the routes
userRouter.use("/:userId/*", requireAuth());

userRouter.get("/:userId/balance", getUserBal);
userRouter.get("/:userId/info", getUserInfo);
userRouter.post("/:userId/groups", getUserGroups);

userRouter.get("/:userId/protected", requireAuth(), (req, res) => {
  res.send("Accessed protected route.");
});

userRouter.use((err, req, res, next) => {
  console.error(err.message);
  console.error(err.stack);
  res.send("Something broke in user routes!");
});

module.exports = userRouter;
