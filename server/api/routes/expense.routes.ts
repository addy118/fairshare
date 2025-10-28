import { NextFunction, Request, Response, Router } from "express";
import { requireAuth } from "@clerk/express";
import {
  postExp,
  getExp,
  settleSplit,
  confirmSplit,
  notConfirmSplit,
  remind,
} from "../../controllers/expense.controller";
const expRouter = Router();

expRouter.use(requireAuth());

expRouter.get("/:expId", getExp);

expRouter.post("/new", postExp);
expRouter.post("/:splitId/remind", remind);

expRouter.put("/:splitId/settle", settleSplit);
expRouter.put("/:splitId/confirm", confirmSplit);
expRouter.put("/:splitId/not-confirm", notConfirmSplit);

export default expRouter;
