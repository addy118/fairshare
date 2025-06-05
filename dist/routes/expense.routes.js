"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_2 = require("@clerk/express");
const expense_controller_1 = require("../controllers/expense.controller");
const expRouter = (0, express_1.Router)();
expRouter.use((0, express_2.requireAuth)());
expRouter.get("/:expId", expense_controller_1.getExp);
expRouter.post("/new", expense_controller_1.postExp);
expRouter.post("/:splitId/remind", expense_controller_1.remind);
expRouter.put("/:splitId/settle", expense_controller_1.settleSplit);
expRouter.put("/:splitId/confirm", expense_controller_1.confirmSplit);
expRouter.put("/:splitId/not-confirm", expense_controller_1.notConfirmSplit);
expRouter.use((error, req, res, next) => {
    console.error(error.message);
    console.error(error.stack);
    res.send("Something broke in expense routes");
});
exports.default = expRouter;
//# sourceMappingURL=expense.routes.js.map