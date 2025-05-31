const { Router, raw } = require("express");
const { postClerkUser } = require("../controllers/clerk.controller");
const clerkRouter = Router();

clerkRouter.post("/user", raw({ type: "application/json" }), postClerkUser);

module.exports = clerkRouter;
