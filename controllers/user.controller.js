const User = require("../prisma/queries/User");

exports.test = async (req, res) => {
  const { data } = req.body;
  try {
    const user = await User.get(data);
    if (!user) return res.status(404).json({ message: "No user found" });
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in tes()t:", error.message);
    console.error(error.stack);
    res.status(400).json({ message: error.message || "Failed to test." });
  }
};

exports.testProtected = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.getById(userId);
    if (!user) return res.status(404).json({ message: "No user found" });
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in testProtecte()d:", error.message);
    console.error(error.stack);
    res
      .status(400)
      .json({ message: error.message || "Failed to test protected route." });
  }
};

exports.getUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.getById(userId);
    if (!user) return res.status(404).json({ message: "No user found" });
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in getUse()r:", error.message);
    console.error(error.stack);
    res.status(400).json({ message: error.message || "Failed to fetch user." });
  }
};

exports.getUserInfo = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.getBasicInfo(userId);
    if (!user) return res.status(404).json({ message: "No user found" });
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in getUserInf()o:", error.message);
    console.error(error.stack);
    res
      .status(400)
      .json({ message: error.message || "Failed to fetch user info." });
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
  } catch (error) {
    console.error("Error in getUserBa()l:", error.message);
    console.error(error.stack);
    res
      .status(400)
      .json({ message: error.message || "Failed to retrieve user balance" });
  }
};

exports.getUserGroups = async (req, res) => {
  try {
    const { userId } = req.params;
    const response = await User.groups(userId);

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error in getUserGroup()s:", error.message);
    console.error(error.stack);
    res
      .status(400)
      .json({ message: error.message || "Failed to retrieve user groups" });
  }
};

exports.getUserUpi = async (req, res) => {
  try {
    const { userId } = req.params;

    const upi = await User.getUpi(userId);
    // console.log(upi);
    return res.status(200).json(upi);
  } catch (error) {
    console.error("Error in getUserUpi(): ", error.message);
    console.error(error.stack);
    res
      .status(400)
      .json({ message: error.message || "Failed to fetch the user's UPI" });
  }
};

exports.putUserUpi = async (req, res) => {
  try {
    const { userId } = req.params;
    const { upi } = req.body;

    await User.putUpi(userId, upi);
    return res.status(200).json({ message: "User UPI updated successfully!" });
  } catch (error) {
    console.error("Error in putUserUpi(): ", error.message);
    console.error(error.stack);
    res
      .status(400)
      .json({ message: error.message || "Failed to update the user's UPI" });
  }
};
