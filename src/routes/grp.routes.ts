import { NextFunction, Request, Response, Router } from "express";
import { requireAuth } from "@clerk/express";
import {
  getAllExpenses,
  getMinSplits,
  getGrpBalance,
  getSplits,
  getGrpHistory,
  postGrp,
  postDelGrp,
  postMember,
  deleteMember,
  getGrpInfo,
} from "../controllers/grp.controller";
const grpRouter = Router();

grpRouter.use(requireAuth());

grpRouter.get("/:grpId/info", getGrpInfo);
grpRouter.get("/:grpId/expenses", getAllExpenses);
grpRouter.get("/:grpId/balance", getGrpBalance);
grpRouter.get("/:grpId/splits/min", getMinSplits);
grpRouter.get("/:grpId/splits", getSplits);
grpRouter.get("/:groupId/history", getGrpHistory);

grpRouter.post("/new", postGrp);
grpRouter.post("/:groupId/member/new", postMember);

grpRouter.delete("/:groupId/member/:memberId", deleteMember);
grpRouter.delete("/:groupId/delete", postDelGrp);

grpRouter.use(
  (error: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(error.message);
    console.error(error.stack);
    res.send("Something broke in group routes");
  }
);

export default grpRouter;
