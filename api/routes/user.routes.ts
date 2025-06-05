import { NextFunction, Request, Response, Router } from "express";
import { requireAuth } from "@clerk/express";
import {
  getUser,
  getUserBal,
  getUserInfo,
  getUserGroups,
  putUserUpi,
  getUserUpi,
} from "../../controllers/user.controller";
const userRouter = Router();

userRouter.get("/:userId", getUser);

// protect the routes
userRouter.use("/:userId/*", requireAuth());

userRouter.get("/:userId/balance", getUserBal);
userRouter.get("/:userId/upi", getUserUpi);
userRouter.get("/:userId/info", getUserInfo);
// userRouter.get("/:userId/protected", requireAuth(), (req, res) => {
//   res.send("Accessed protected route.");
// });

userRouter.put("/:userId/upi", putUserUpi);

// userRouter.post("/:userId/upi", postUserUpi);
userRouter.post("/:userId/groups", getUserGroups);

userRouter.use(
  (error: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(error.message);
    console.error(error.stack);
    res.send("Something broke in user routes!");
  }
);

export default userRouter;
