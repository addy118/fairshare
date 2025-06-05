"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_2 = require("@clerk/express");
const user_controller_1 = require("../controllers/user.controller");
const userRouter = (0, express_1.Router)();
userRouter.get("/:userId", user_controller_1.getUser);
userRouter.use("/:userId/*", (0, express_2.requireAuth)());
userRouter.get("/:userId/balance", user_controller_1.getUserBal);
userRouter.get("/:userId/upi", user_controller_1.getUserUpi);
userRouter.get("/:userId/info", user_controller_1.getUserInfo);
userRouter.put("/:userId/upi", user_controller_1.putUserUpi);
userRouter.post("/:userId/groups", user_controller_1.getUserGroups);
userRouter.use((error, req, res, next) => {
    console.error(error.message);
    console.error(error.stack);
    res.send("Something broke in user routes!");
});
exports.default = userRouter;
//# sourceMappingURL=user.routes.js.map