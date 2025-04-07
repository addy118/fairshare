const { split } = require("../config/prismaClient");
const Group = require("../prisma/queries/Group");
const Split = require("../prisma/queries/Split");
const { calculateSplits, getSplitBalance, mergeChrono } = require("./util");

exports.postGrp = async (req, res) => {
  const { name } = req.body;

  const group = await Group.create(name);
  res.json({ msg: "success", group });
};

exports.postDelGrp = async (req, res) => {
  const { groupId } = req.params;

  await Group.delete(Number(groupId));
  res.json({ msg: "success" });
};

exports.postMember = async (req, res) => {
  const { groupId, memberId } = req.params;

  await Group.join(Number(memberId), Number(groupId));
  res.json({ msg: "success" });
};

exports.deleteMember = async (req, res) => {
  const { groupId, memberId } = req.params;

  await Group.leave(Number(memberId), Number(groupId));
  res.json({ msg: "success" });
};

exports.getAllExpenses = async (req, res) => {
  const { grpId } = req.params;

  let group = await Group.expenses(Number(grpId));
  group = { expenses: group[0].expenses, splits: group[0].splits };
  res.json(group);
};

exports.getGrpBalance = async (req, res) => {
  const { grpId } = req.params;

  const group = await Group.expenses(Number(grpId));
  const splits = group[0].splits;
  const cleanSplits = splits.map((split) => {
    return {
      debtorId: Number(split.debtorId),
      creditorId: Number(split.creditorId),
      amount: Number(split.amount),
    };
  });
  // console.log(splits);

  const splitBalance = getSplitBalance(cleanSplits);
  const balance = Object.entries(splitBalance).map(([userId, amount]) => ({
    userId: Number(userId),
    amount: Number(amount),
  }));

  res.json(balance);
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

exports.getGrpHistory = async (req, res) => {
  const { groupId } = req.params;

  const members = await Group.members(Number(groupId));
  const expenses = await Group.expenseHistory(Number(groupId));
  const splits = await Group.splitsHistory(Number(groupId));

  // merge chronologicall all the expenses and splits
  const timeline = mergeChrono(expenses, splits);
  console.log(timeline);

  const balance = {};
  members.forEach((member) => (balance[member.memberId] = 0));
  console.log(balance);

  for (const entry of timeline) {
    if (entry.type == "expense") {
      const totalPeople = entry.payers.length;
      const share = Math.floor(entry.totalAmt / totalPeople);

      entry.payers.forEach(({ payerId, paidAmt }) => {
        balance[payerId] += paidAmt - share;
      });
    } else if (entry.type == "split") {
      // amounts are always positive
      balance[entry.debtorId] += entry.amount;
      balance[entry.creditorId] -= entry.amount;
    }
    entry.balance = { ...balance };
    console.log(balance);
  }

  res.json(timeline);
};

exports.isMember = (groupId, userId) => {
  // check if there is a row with composite id groupId_userId in member table
};
