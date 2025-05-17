const { Router } = require("express");
const { verifyToken } = require("../controllers/authController");
const {
  postExp,
  getExp,
  settleSplit,
  confirmSplit,
  notConfirmSplit,
  remind,
} = require("../controllers/expenseController");
const expRouter = Router();

expRouter.use(verifyToken);

expRouter.get("/:expId", getExp);

expRouter.post("/new", postExp);
expRouter.post("/:splitId/remind", remind);

expRouter.put("/:splitId/settle", settleSplit);
expRouter.put("/:splitId/confirm", confirmSplit);
expRouter.put("/:splitId/not-confirm", notConfirmSplit);

expRouter.use((err, req, res, next) => {
  console.error(err.message);
  console.error(err.stack);
  res.send("Something broke in expense routes");
});

module.exports = expRouter;
