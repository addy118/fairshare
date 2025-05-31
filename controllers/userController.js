const bcrypt = require("bcryptjs");
const User = require("../prisma/queries/User");

exports.test = async (req, res) => {
  const { data } = req.body;
  try {
    const user = await User.get(data);
    if (!user) return res.status(404).json({ msg: "No user found" });
    res.status(200).json(user);
  } catch (err) {
    console.error("ERROR in test:", err);
    res.status(500).json({ msg: err.message });
  }
};

exports.testProtected = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.getById(userId);
    if (!user) return res.status(404).json({ msg: "No user found" });
    res.status(200).json(user);
  } catch (err) {
    console.error("ERROR in testProtected:", err);
    res.status(500).json({ msg: err.message });
  }
};

exports.getUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.getById(userId);
    if (!user) return res.status(404).json({ msg: "No user found" });
    res.status(200).json(user);
  } catch (err) {
    console.error("ERROR in getUser:", err);
    res.status(400).json({ msg: err.message });
  }
};

exports.getUserInfo = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.getBasicInfo(userId);
    if (!user) return res.status(404).json({ msg: "No user found" });
    res.status(200).json(user);
  } catch (err) {
    console.error("ERROR in getUser:", err);
    res.status(400).json({ msg: err.message });
  }
};

exports.getUserBal = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId)
    const balance = await User.balance(userId);
    res.json(balance);
  } catch (err) {
    console.error("ERROR in getUserBal:", err);
    res.status(400).json({ msg: "Failed to retrieve user balance" });
  }
};

exports.getUserGroups = async (req, res) => {
  try {
    const { userId } = req.params;
    const res = await User.groups(userId);
    console.log(res);
  } catch (err) {
    console.error("ERROR in getUserGroup:", err);
    res.status(400).json({ msg: "Failed to retrieve user groups" });
  }
};
