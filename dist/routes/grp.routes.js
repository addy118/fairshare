"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_2 = require("@clerk/express");
const grp_controller_1 = require("../controllers/grp.controller");
const grpRouter = (0, express_1.Router)();
grpRouter.use((0, express_2.requireAuth)());
grpRouter.get("/:grpId/info", grp_controller_1.getGrpInfo);
grpRouter.get("/:grpId/expenses", grp_controller_1.getAllExpenses);
grpRouter.get("/:grpId/balance", grp_controller_1.getGrpBalance);
grpRouter.get("/:grpId/splits/min", grp_controller_1.getMinSplits);
grpRouter.get("/:grpId/splits", grp_controller_1.getSplits);
grpRouter.get("/:groupId/history", grp_controller_1.getGrpHistory);
grpRouter.post("/new", grp_controller_1.postGrp);
grpRouter.post("/:groupId/member/new", grp_controller_1.postMember);
grpRouter.delete("/:groupId/member/:memberId", grp_controller_1.deleteMember);
grpRouter.delete("/:groupId/delete", grp_controller_1.postDelGrp);
grpRouter.use((error, req, res, next) => {
    console.error(error.message);
    console.error(error.stack);
    res.send("Something broke in group routes");
});
exports.default = grpRouter;
//# sourceMappingURL=grp.routes.js.map