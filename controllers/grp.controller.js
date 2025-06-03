const Group = require("../prisma/queries/Group");
const Split = require("../prisma/queries/Split");
const User = require("../prisma/queries/User");
const { calculateSplits, mergeChrono, getGroupBalance } = require("./util");

exports.postGrp = async (req, res) => {
  try {
    const { name } = req.body;
    const group = await Group.create(name);
    res.json({ message: "success", group });
  } catch (error) {
    console.error("Error in postGrp(): ", error.message);
    console.error(error.stack);
    res
      .status(400)
      .json({ message: error.message || "Failed to create group" });
  }
};

exports.postDelGrp = async (req, res) => {
  try {
    const { groupId } = req.params;
    await Group.delete(Number(groupId));
    res.json({ message: "success" });
  } catch (error) {
    console.error("Error in postDelGrp(): ", error.message);
    console.error(error.stack);
    res
      .status(400)
      .json({ message: error.message || "Failed to delete group" });
  }
};

exports.postMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { username } = req.body;

    const userId = await User.getIdbyUserName(username);
    await Group.join(userId, Number(groupId));
    res.json({ message: "success" });
  } catch (error) {
    console.error("Error in postMember(): ", error.message);
    console.error(error.stack);
    res
      .status(400)
      .json({ message: error.message || "Failed to add user to group." });
  }
};

exports.deleteMember = async (req, res) => {
  try {
    const { groupId, memberId } = req.params;
    await Group.leave(memberId, Number(groupId));
    res.json({ message: "success" });
  } catch (error) {
    console.error("Error in deleteMember(): ", error.message);
    console.error(error.stack);
    res
      .status(400)
      .json({ message: error.message || "Failed to remove member from group" });
  }
};

exports.getGrpInfo = async (req, res) => {
  try {
    const { grpId } = req.params;
    const group = await Group.getById(Number(grpId));
    res.json(group);
  } catch (error) {
    console.error("Error in getGrpInfo(): ", error.message);
    console.error(error.stack);
    res.status(400).json({
      message: error.message || "Failed to retrieve group information",
    });
  }
};

exports.getAllExpenses = async (req, res) => {
  try {
    const { grpId } = req.params;
    const group = await Group.expenses(Number(grpId));
    res.json(group);
  } catch (error) {
    console.error("Error in getAllExpenses(): ", error.message);
    console.error(error.stack);
    res
      .status(400)
      .json({ message: error.message || "Failed to retrieve group expenses" });
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
  } catch (error) {
    console.error("Error in getGrpBalance(): ", error.message);
    console.error(error.stack);
    res
      .status(400)
      .json({ message: error.message || "Failed to calculate group balance" });
  }
};

exports.getSplits = async (req, res) => {
  try {
    const { grpId } = req.params;
    const splits = await Group.splits(Number(grpId));
    res.json(splits);
  } catch (error) {
    console.error("Error in getSplits(): ", error.message);
    console.error(error.stack);
    res.status(400).json({
      message: error.message || "Failed to retrieve splits information",
    });
  }
};

exports.getMinSplits = async (req, res) => {
  try {
    const { grpId } = req.params;

    // get the current group balance for optimizing purpose
    const balance = await getGroupBalance(grpId, true);
    // console.log("Initial Balance: ", balance);

    // THE CORE THING: get the splits based on the current group balance
    const newSplits = calculateSplits(balance);
    // console.log("Raw Optimized Splits: ", newSplits);

    // transform the response to push in db
    const splitsArr = newSplits.map((split) => {
      return {
        name: "Optimized Split",
        groupId: Number(grpId),
        debtorId: split[0],
        creditorId: split[1],
        amount: Number(split[2]),
      };
    });
    // console.log("Splits Array: ", splitsArr);

    // delete all the previous "redundant splits"
    await Split.deleteAll(Number(grpId));

    // push new optimized splits in db
    await Split.createMany(splitsArr);

    // get the splits from the group with debtor & creditor details
    const minSplits = await Group.splits(Number(grpId));
    // console.log("Final Optimized Splits: ", minSplits);

    res.json(minSplits);
  } catch (error) {
    console.error("Error in getMinSplits(): ", error.message);
    console.error(error.stack);
    res.status(400).json({
      message:
        error.message || "Failed to calculate and update optimized splits",
    });
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
            pfp: await User.getPfpById(userId),
          },
          amount: Number(amount),
        }))
      );
    }

    res.json(timeline);
  } catch (error) {
    console.error("Error in getGrpHistory(): ", error.message);
    console.error(error.stack);
    res
      .status(400)
      .json({ message: error.message || "Failed to retrieve group history" });
  }
};
