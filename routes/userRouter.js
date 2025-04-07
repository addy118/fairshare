const { Router } = require("express");
const {
  verifyToken,
  verifyOwnership,
} = require("../controllers/authController");
const {
  getUser,
  putUserName,
  putUserEmail,
  putUserPass,
  delUser,
  testProtected,
  getUserBal,
} = require("../controllers/userController");
const { validateReq } = require("../config/validation/req");
const {
  validateName,
  validateEmail,
  validatePass,
} = require("../config/validation/user");
const userRouter = Router();

userRouter.get("/:userId", getUser);

// protect the routes
userRouter.use("/:userId/*", [verifyToken, verifyOwnership]);

userRouter.get("/:userId/balance", getUserBal);

userRouter.post("/:userId/protected", testProtected);

userRouter.put("/:userId/name", [validateName, validateReq, putUserName]);
userRouter.put("/:userId/email", [validateEmail, validateReq, putUserEmail]);
userRouter.put("/:userId/password", [validatePass, validateReq, putUserPass]);

userRouter.delete("/:userId", delUser);

userRouter.use((err, req, res, next) => {
  console.error(err.message);
  console.error(err.stack);
  res.send("Something broke in user routes!");
});

module.exports = userRouter;
