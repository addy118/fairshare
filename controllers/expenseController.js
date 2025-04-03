exports.postExp = async (req, res) => {
  const { name, groupId, payers } = req.body;

  res.json({ name, groupId, payers });
};
