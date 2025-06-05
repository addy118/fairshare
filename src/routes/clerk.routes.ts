import { Router, raw } from "express";
import { postClerkUser } from "../controllers/clerk.controller";
const clerkRouter = Router();

clerkRouter.post("/user", raw({ type: "application/json" }), postClerkUser);

export default clerkRouter;
