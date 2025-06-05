"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Split_1 = __importDefault(require("../queries/Split"));
const Group_1 = __importDefault(require("../queries/Group"));
const util_1 = require("./util");
(async () => {
    const balance = await (0, util_1.getGroupBalance)(3);
    console.log("Initial Balance: ", balance);
    const newSplits = (0, util_1.calculateSplits)(balance);
    console.log("Raw Optimized Splits: ", newSplits);
    const splitsArr = newSplits.map((split) => {
        return {
            name: "Optimized Split",
            groupId: Number(3),
            debtorId: split[0],
            creditorId: split[1],
            amount: Number(split[2]),
        };
    });
    console.log("Splits Array: ", splitsArr);
    await Split_1.default.deleteAll(Number(3));
    await Split_1.default.createMany(splitsArr);
    const minSplits = await Group_1.default.splits(Number(3));
    console.log("Final Optimized Splits: ", minSplits);
})();
//# sourceMappingURL=index.js.map