const { Router } = require("express");
const { requireAuth } = require("@clerk/express");
const {
  postExp,
  getExp,
  settleSplit,
  confirmSplit,
  notConfirmSplit,
  remind,
} = require("../controllers/expense.controller");
const expRouter = Router();

expRouter.use(requireAuth());

expRouter.get("/:expId", getExp);

expRouter.post("/new", postExp);
expRouter.post("/:splitId/remind", remind);

expRouter.put("/:splitId/settle", settleSplit);
expRouter.put("/:splitId/confirm", confirmSplit);
expRouter.put("/:splitId/not-confirm", notConfirmSplit);

expRouter.use((error, req, res, next) => {
  console.error(error.message);
  console.error(error.stack);
  res.send("Something broke in expense routes");
});

module.exports = expRouter;
