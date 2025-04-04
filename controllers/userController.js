const bcrypt = require("bcryptjs");
const User = require("../prisma/queries/User");

exports.test = async (req, res) => {
  const { data } = req.body;
  try {
    const user = await User.get(data);
    if (!user) return res.status(404).json({ msg: "No user found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
};

exports.testProtected = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.getById(Number(userId));
    if (!user) return res.status(404).json({ msg: "No user found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.getById(Number(userId));
    if (!user) return res.status(404).json({ msg: "No user found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserBal = async (req, res) => {};

exports.putUserName = async (req, res) => {
  const { userId } = req.params;
  const { name } = req.body;

  try {
    await User.changeName(Number(userId), name);
    res.status(200).json({ msg: "Name updated successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.putUserEmail = async (req, res) => {
  const { userId } = req.params;
  const { email } = req.body;

  try {
    await User.changeEmail(Number(userId), email);
    res.status(200).json({ msg: "Email updated successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.putUserBio = async (req, res) => {
  const { userId } = req.params;
  const { bio } = req.body;

  try {
    await User.changeBio(Number(userId), bio);
    res.status(200).json({ msg: "Bio updated successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.putUserPass = async (req, res) => {
  const { userId } = req.params;
  const { oldPass, newPass } = req.body;

  try {
    // check old password
    // console.log(req.user);
    const matched = await bcrypt.compare(oldPass, req.user.password);
    if (!matched) return res.status(400).json({ msg: "Wrong password!" });

    // change the password
    const hashedPass = await bcrypt.hash(newPass, 10);
    await User.changePass(Number(userId), hashedPass);
    res.status(200).json({ msg: "Password updated successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delUser = async (req, res) => {
  try {
    await User.delete(req.user.id);
    res.status(204).json({ msg: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
