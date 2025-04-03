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
