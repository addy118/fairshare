"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postClerkUser = void 0;
const webhooks_1 = require("@clerk/express/webhooks");
const User_1 = __importDefault(require("../queries/User"));
const postClerkUser = async (req, res) => {
    try {
        const evt = (await (0, webhooks_1.verifyWebhook)(req));
        switch (evt.type) {
            case "user.created":
                await User_1.default.create(evt.data);
                break;
            case "user.updated":
                await User_1.default.update(evt.data);
                break;
            case "user.deleted":
                await User_1.default.delete(evt.data);
                break;
        }
        res.status(200).json({ msg: "Webhook processed successfully!" });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error verifying webhook:", error.message);
            console.error(error.stack);
            res
                .status(400)
                .json({ message: error.message || "Error verifying webhook" });
        }
    }
};
exports.postClerkUser = postClerkUser;
//# sourceMappingURL=clerk.controller.js.map