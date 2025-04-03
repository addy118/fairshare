const { Router } = require("express");
const {
  getAllExpenses,
  getMinSplits,
} = require("../controllers/grpController");
const grpRouter = new Router();

grpRouter.get("/:grpId", getAllExpenses);
grpRouter.get("/:grpId/splits", getMinSplits);

grpRouter.use((err, req, res, next) => {
  console.error(err.message);
  console.error(err.stack);
  res.send("Something broke in group routes");
});

module.exports = grpRouter;
