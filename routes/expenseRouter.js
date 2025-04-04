const { Router } = require("express");
const {
  verifyToken,
  verifyOwnership,
} = require("../controllers/authController");
const { postExp, getExp } = require("../controllers/expenseController");
const expRouter = Router();

// expRouter.use([verifyToken, verifyOwnership]);

expRouter.post("/new", postExp);
expRouter.post("/:splitId/settle");
expRouter.get("/:expId", getExp);

expRouter.use((err, req, res, next) => {
  console.error(err.message);
  console.error(err.stack);
  res.send("Something broke in expense routes");
});

module.exports = expRouter;
