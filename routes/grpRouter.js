const { Router } = require("express");
const {
  getAllExpenses,
  getMinSplits,
  getGrpBalance,
} = require("../controllers/grpController");
const grpRouter = new Router();

grpRouter.get("/:grpId", getAllExpenses);
grpRouter.get("/:grpId/balance", getGrpBalance);
grpRouter.get("/:grpId/splits/min", getMinSplits);

grpRouter.use((err, req, res, next) => {
  console.error(err.message);
  console.error(err.stack);
  res.send("Something broke in group routes");
});

module.exports = grpRouter;
