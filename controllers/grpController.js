const { split } = require("../config/prismaClient");
const Group = require("../prisma/queries/Group");
const Split = require("../prisma/queries/Split");
const User = require("../prisma/queries/User");
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

  const group = await Group.expenses(Number(grpId));
  res.json(group);
};

exports.getGrpBalance = async (req, res) => {
  const { grpId } = req.params;

  const group = await Group.expenses(Number(grpId));
  const splits = group.splits;
  const cleanSplits = splits.map((split) => {
    return {
      debtor: {
        id: Number(split.debtor.id),
        name: split.debtor.name,
      },
      creditor: {
        id: Number(split.creditor.id),
        name: split.creditor.name,
      },
      amount: Number(split.amount),
    };
  });

  const splitBalance = getSplitBalance(cleanSplits);
  // console.log(splitBalance);

  const balance = await Promise.all(
    Object.entries(splitBalance).map(async ([userId, amount]) => ({
      user: {
        id: Number(userId),
        name: await User.getNameById(Number(userId)),
      },
      amount: Number(amount),
    }))
  );

  // console.log(balance);

  res.json(balance);
};

exports.getSplits = async (req, res) => {
  const { grpId } = req.params;

  const splits = await Group.splits(Number(grpId));
  res.json(splits);
};

exports.getMinSplits = async (req, res) => {
  const { grpId } = req.params;

  const splits = await Group.splits(Number(grpId));

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
  await Split.createMany(splitsArr);
  const minSplits = await Group.splits(Number(grpId));

  res.json(minSplits);
};

exports.getGrpHistory = async (req, res) => {
  const { groupId } = req.params;

  const members = await Group.members(Number(groupId));
  const expenses = await Group.expenseHistory(Number(groupId));
  const splits = await Group.splitsHistory(Number(groupId));

  // merge chronologically all the expenses and splits
  const timeline = mergeChrono(expenses, splits);

  // initialize balance as 0 for all members
  const balance = {};
  members.forEach((mem) => (balance[mem.member.id] = 0));

  // update balance after each payment
  for (const entry of timeline) {
    // past expense
    if (entry.type == "expense") {
      const totalPeople = entry.payers.length;
      const share = Math.floor(entry.totalAmt / totalPeople);

      entry.payers.forEach(({ payer, paidAmt }) => {
        balance[payer.id] += paidAmt - share;
      });
    }

    // past split
    else if (entry.type == "split") {
      // amounts are always positive
      balance[entry.debtor.id] += entry.amount;
      balance[entry.creditor.id] -= entry.amount;
    }

    // accumulate balance and convert to array of objects
    entry.balance = await Promise.all(
      Object.entries(balance).map(async ([userId, amount]) => ({
        user: {
          id: Number(userId),
          name: await User.getNameById(Number(userId)),
        },
        amount: Number(amount),
      }))
    );
  }

  res.json(timeline);
};
