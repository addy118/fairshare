const { split } = require("../config/prismaClient");
const Group = require("../prisma/queries/Group");
const Split = require("../prisma/queries/Split");
const User = require("../prisma/queries/User");
const {
  calculateSplits,
  getSplitBalance,
  mergeChrono,
  getGroupBalance,
} = require("./util");

exports.postGrp = async (req, res) => {
  try {
    const { name } = req.body;
    const group = await Group.create(name);
    res.json({ msg: "success", group });
  } catch (err) {
    console.error("ERROR in postGrp:", err);
    res.status(400).json({ msg: "Failed to create group" });
  }
};

exports.postDelGrp = async (req, res) => {
  try {
    const { groupId } = req.params;
    await Group.delete(Number(groupId));
    res.json({ msg: "success" });
  } catch (err) {
    console.error("ERROR in postDelGrp:", err);
    res.status(400).json({ msg: "Failed to delete group" });
  }
};

exports.postMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { username } = req.body;

    const userId = await User.getIdbyUserName(username);
    await Group.join(userId, Number(groupId));
    res.json({ msg: "success" });
  } catch (err) {
    console.error("ERROR in postMember:", err);
    res.status(400).json({ msg: "Failed to add member to group" });
  }
};

exports.deleteMember = async (req, res) => {
  try {
    const { groupId, memberId } = req.params;
    await Group.leave(Number(memberId), Number(groupId));
    res.json({ msg: "success" });
  } catch (err) {
    console.error("ERROR in deleteMember:", err);
    res.status(400).json({ msg: "Failed to remove member from group" });
  }
};

exports.getGrpInfo = async (req, res) => {
  try {
    const { grpId } = req.params;
    const group = await Group.getById(Number(grpId));
    res.json(group);
  } catch (err) {
    console.error("ERROR in getGrpInfo:", err);
    res.status(400).json({ msg: "Failed to retrieve group information" });
  }
};

exports.getAllExpenses = async (req, res) => {
  try {
    const { grpId } = req.params;
    const group = await Group.expenses(Number(grpId));
    res.json(group);
  } catch (err) {
    console.error("ERROR in getAllExpenses:", err);
    res.status(400).json({ msg: "Failed to retrieve group expenses" });
  }
};

exports.getGrpBalance = async (req, res) => {
  try {
    const { grpId } = req.params;
    const rawBalance = await getGroupBalance(grpId);

    const balance = await Promise.all(
      Object.entries(rawBalance).map(async ([userId, amount]) => ({
        user: {
          id: userId,
          name: await User.getNameById(userId),
        },
        amount: Number(amount),
      }))
    );

    res.json(balance);
  } catch (err) {
    console.error("ERROR in getGrpBalance:", err);
    res.status(400).json({ msg: "Failed to calculate group balance" });
  }
};

exports.getSplits = async (req, res) => {
  try {
    const { grpId } = req.params;
    const splits = await Group.splits(Number(grpId));
    res.json(splits);
  } catch (err) {
    console.error("ERROR in getSplits:", err);
    res.status(400).json({ msg: "Failed to retrieve splits information" });
  }
};

exports.getMinSplits = async (req, res) => {
  try {
    const { grpId } = req.params;

    const balance = await getGroupBalance(grpId);
    const newSplits = calculateSplits(balance);
    // console.log(newSplits);

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
  } catch (err) {
    console.error("ERROR in getMinSplits:", err);
    res
      .status(400)
      .json({ msg: "Failed to calculate and update optimized splits" });
  }
};

exports.getGrpHistory = async (req, res) => {
  try {
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
        // IMPORTANT: amounts are always positive
        // NOTE: BEWARE OF +VE/-VE SIGNS
        balance[entry.debtor.id] += entry.amount;
        balance[entry.creditor.id] -= entry.amount;
      }

      // accumulate balance and convert to array of objects
      entry.balance = await Promise.all(
        Object.entries(balance).map(async ([userId, amount]) => ({
          user: {
            id: userId,
            name: await User.getNameById(userId),
          },
          amount: Number(amount),
        }))
      );
    }

    res.json(timeline);
  } catch (err) {
    console.error("ERROR in getGrpHistory:", err);
    res.status(400).json({ msg: "Failed to retrieve group history" });
  }
};
