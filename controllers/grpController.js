const Group = require("../prisma/queries/Group");
const Split = require("../prisma/queries/Split");
const {
  calculateSplits,
  getExpBalance,
  getSplitBalance,
  calcTolerance,
} = require("./split");

exports.getAllExpenses = async (req, res) => {
  const { grpId } = req.params;

  let group = await Group.expenses(Number(grpId));
  group = { expenses: group[0].expenses, splits: group[0].splits };
  res.json(group);
};

exports.getGrpBalance = async (req, res) => {
  const { grpId } = req.params;

  const group = await Group.expenses(Number(grpId));
  const expenses = group[0].expenses;
  const splits = group[0].splits;
  const cleanSplits = splits.map((split) => {
    return {
      debtorId: Number(split.debtorId),
      creditorId: Number(split.creditorId),
      amount: Number(split.amount),
    };
  });
  console.log(splits);

  const expBalance = getExpBalance(expenses);
  const splitBalance = getSplitBalance(cleanSplits);
  const tolerance = calcTolerance(expBalance, splitBalance);
  console.log(tolerance);

  res.json({ splitBalance, tolerance });
};

exports.getMinSplits = async (req, res) => {
  const { grpId } = req.params;

  let splits = await Group.splits(Number(grpId));
  splits = splits[0].splits;

  const oldBalance = getSplitBalance(splits);
  const newSplits = calculateSplits(oldBalance);
  console.log(newSplits);

  const splitsArr = newSplits.map((split) => {
    return {
      name: "Optimized Split",
      groupId: Number(grpId),
      debtorId: Number(split[0]),
      creditorId: Number(split[1]),
      amount: Number(split[2]),
    };
  });

  await Split.deleteAll(Number(grpId));
  const minSplits = await Split.createMany(splitsArr);
  console.log(splitsArr);
  console.log(minSplits);

  res.json(minSplits);
};

exports.getSplits = async (req, res) => {
  const { grpId } = req.params;

  let splits = await Group.splits(Number(grpId));
  splits = splits[0].splits;

  return res.json(splits);
};

exports.getGrpHistory = async (req, res) => {};

exports.isMember = (groupId, userId) => {
  // check if there is a row with composite id groupId_userId in member table
  
}