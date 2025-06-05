"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const clerk_controller_1 = require("../controllers/clerk.controller");
const clerkRouter = (0, express_1.Router)();
clerkRouter.post("/user", (0, express_1.raw)({ type: "application/json" }), clerk_controller_1.postClerkUser);
exports.default = clerkRouter;
//# sourceMappingURL=clerk.routes.js.map