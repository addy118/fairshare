const Group = require("../prisma/queries/Group");
const User = require("../prisma/queries/User");
const {
  getSplitBalance,
  mergeChrono,
  getGroupBalance,
  calculateSplits,
} = require("./util");

(async () => {
  // get the current group balance for optimizing purpose
  const balance = await getGroupBalance(3);
  console.log("Initial Balance: ", balance);

  // THE CORE THING: get the splits based on the current group balance
  const newSplits = calculateSplits(balance);
  console.log("Raw Optimized Splits: ", newSplits);

  // transform the response to push in db
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

  // delete all the previous "redundant splits"
  await Split.deleteAll(Number(3));

  // push new optimized splits in db
  await Split.createMany(splitsArr);

  // get the splits from the group with debtor & creditor details
  const minSplits = await Group.splits(Number(3));
  console.log("Final Optimized Splits: ", minSplits);
})();
