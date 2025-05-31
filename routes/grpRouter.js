const { Router } = require("express");
const {
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
} = require("../controllers/grpController");
const { verifyToken } = require("../controllers/authController");
const grpRouter = new Router();

// grpRouter.use(verifyToken);

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

grpRouter.use((err, req, res, next) => {
  console.error(err.message);
  console.error(err.stack);
  res.send("Something broke in group routes");
});

module.exports = grpRouter;
