const Group = require("../prisma/queries/Group");

exports.getAllExpenses = async (req, res) => {
  const { grpId } = req.params;

  let group = await Group.expenses(Number(grpId));
  group = { expenses: group[0].expenses, splits: group[0].splits };
  res.json(group);
};

exports.getMinSplits = async (req, res) => {
  const { grpId } = req.params;

  let splits = await Group.splits(Number(grpId));
  splits = splits[0].splits;
  console.log(splits.length);

  res.json(splits);
};

const splits = [
  { debtorId: 3, creditorId: 6, amount: 2, settled: false },
  { debtorId: 3, creditorId: 4, amount: 16, settled: false },
  { debtorId: 2, creditorId: 4, amount: 6, settled: false },
  { debtorId: 2, creditorId: 5, amount: 42, settled: false },
  { debtorId: 4, creditorId: 2, amount: 33, settled: false },
  { debtorId: 3, creditorId: 2, amount: 83, settled: false },
  { debtorId: 2, creditorId: 3, amount: 25, settled: false },
  { debtorId: 6, creditorId: 3, amount: 10, settled: false },
];
