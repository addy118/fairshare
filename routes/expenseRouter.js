const { Router } = require("express");
const { verifyToken } = require("../controllers/authController");
const {
  postExp,
  getExp,
  settleSplit,
} = require("../controllers/expenseController");
const expRouter = Router();

expRouter.use(verifyToken);

expRouter.get("/:expId", getExp);

expRouter.post("/new", postExp);
expRouter.post("/:splitId/settle", settleSplit);

expRouter.use((err, req, res, next) => {
  console.error(err.message);
  console.error(err.stack);
  res.send("Something broke in expense routes");
});

module.exports = expRouter;
