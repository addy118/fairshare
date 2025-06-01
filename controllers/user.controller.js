const User = require("../prisma/queries/User");

exports.test = async (req, res) => {
  const { data } = req.body;
  try {
    const user = await User.get(data);
    if (!user) return res.status(404).json({ message: "No user found" });
    res.status(200).json(user);
  } catch (err) {
    console.error("Error in test:", err);
    res.status(400).json({ message: err.message });
  }
};

exports.testProtected = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.getById(userId);
    if (!user) return res.status(404).json({ message: "No user found" });
    res.status(200).json(user);
  } catch (err) {
    console.error("Error in testProtected:", err);
    res.status(400).json({ message: err.message });
  }
};

exports.getUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.getById(userId);
    if (!user) return res.status(404).json({ message: "No user found" });
    res.status(200).json(user);
  } catch (err) {
    console.error("Error in getUser:", err);
    res.status(400).json({ message: err.message });
  }
};

exports.getUserInfo = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.getBasicInfo(userId);
    if (!user) return res.status(404).json({ message: "No user found" });
    res.status(200).json(user);
  } catch (err) {
    console.error("Error in getUser:", err);
    res.status(400).json({ message: err.message });
  }
};

exports.getUserBal = async (req, res) => {
  try {
    const { userId } = req.params;

    const balance = await User.balance(userId);

    // merge logic for debtor
    const mergedDebtor = {};
    balance.debtor.forEach((item) => {
      const id = item.creditor.id;
      if (mergedDebtor[id]) {
        mergedDebtor[id].amount += item.amount;
      } else {
        mergedDebtor[id] = { ...item };
      }
    });

    // merge logic for creditor
    const mergedCreditor = {};
    balance.creditor.forEach((item) => {
      const id = item.debtor.id;
      if (mergedCreditor[id]) {
        mergedCreditor[id].amount += item.amount;
      } else {
        mergedCreditor[id] = { ...item };
      }
    });

    res.json({
      debtor: Object.values(mergedDebtor),
      creditor: Object.values(mergedCreditor),
    });
  } catch (err) {
    console.error("Error in getUserBal:", err);
    res.status(400).json({ message: "Failed to retrieve user balance" });
  }
};

exports.getUserGroups = async (req, res) => {
  try {
    const { userId } = req.params;
    const response = await User.groups(userId);

    return res.status(200).json(response);
  } catch (err) {
    console.error("Error in getUserGroups:", err);
    res.status(400).json({ message: "Failed to retrieve user groups" });
  }
};

exports.getUserUpi = async (req, res) => {
  try {
    const { userId } = req.params;

    const upi = await User.getUpi(userId);
    // console.log(upi);
    return res.status(200).json(upi);
  } catch (err) {
    console.error("Error in getUserUpi: ", err);
    res.status(400).json({ message: "Failed to fetch the user's UPI" });
  }
};

exports.putUserUpi = async (req, res) => {
  try {
    const { userId } = req.params;
    const { upi } = req.body;

    await User.putUpi(userId, upi);
    return res.status(200).json({ message: "User UPI updated successfully!" });
  } catch (err) {
    console.error("Error in putUserUpi: ", err);
    res.status(400).json({ message: "Failed to update the user's UPI" });
  }
};
