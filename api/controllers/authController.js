require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../prisma/queries/User");
const { ACCESS_TOKEN, REFRESH_TOKEN } = process.env;

exports.postSignup = async (req, res) => {
  const { name, username, phone, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create(
      name,
      username,
      phone,
      email,
      hashedPassword
    );
    res.status(200).json({ user });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({
        msg: "Email, Phone or Username already exists. Please choose a different one.",
      });
    }
    console.error("Error during signup: ", error.stack);
    res.status(500).json({ msg: "Failed to create user. Please try again." });
  }
};

exports.postLogin = async (req, res) => {
  const { data, password } = req.body;

  try {
    const user = await User.get(data);
    if (!user) return res.status(404).send("User not found!");

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) return res.status(400).send("Invalid password!");

    const { accessToken, refreshToken } = generateTokens(user);

    // send set-cookie header with response
    res.cookie("refreshCookie", refreshToken, {
      httpOnly: true,
      secure: true, // true in production (only send over https)
      sameSite: "None",
    });

    const decoded = jwt.verify(accessToken, ACCESS_TOKEN);
    return res.json({ msg: "Login Successful!", accessToken, user: decoded });
  } catch (error) {
    console.error("Error during login: ", error.stack);
    res.status(500).json({ msg: "Login failed. Please try again." });
  }
};

exports.postLogout = async (req, res) => {
  try {
    res.clearCookie("refreshCookie", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.status(200).json({ msg: "Logged out successfully" });
  } catch (error) {
    console.error("Error during logout: ", error.stack);
    res.status(500).json({ msg: "Logout failed. Please try again." });
  }
};

exports.getToken = async (req, res) => {
  const bearerHeader = req.headers["authorization"];
  const accessToken = bearerHeader && bearerHeader.split(" ")[1];
  if (!accessToken)
    return res.status(403).json({ msg: "Invalid or expired token" });

  try {
    const decoded = jwt.verify(accessToken, ACCESS_TOKEN);
    return res.json({ accessToken, user: decoded });
  } catch (err) {
    console.error("Error verifying token: ", err.stack);
    res.status(403).json({ msg: "Invalid or expired token" });
  }
};

exports.verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  const accessToken = bearerHeader && bearerHeader.split(" ")[1];
  if (!accessToken) return res.status(500).send("Unauthorized access!");

  try {
    const decoded = jwt.verify(accessToken, ACCESS_TOKEN);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Error verifying access token: ", err.stack);
    res.status(403).json({ msg: "Invalid or expired token" });
  }
};

exports.refresh = async (req, res) => {
  const refreshCookie = req.cookies.refreshCookie;

  if (!refreshCookie) {
    return res.status(401).json({ msg: "Unauthorized: No Token Found" });
  }

  try {
    const decoded = jwt.verify(refreshCookie, REFRESH_TOKEN);
    const user = await User.getById(decoded.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    res.cookie("refreshCookie", refreshToken, {
      httpOnly: true,
      secure: true, // true in production (only send over https)
      sameSite: "None",
    });

    res.json({ msg: "Tokens Regenerated", accessToken });
  } catch (error) {
    console.error("Error refreshing token: ", error.stack);
    return res.status(403).json({ msg: "Invalid or expired refresh token" });
  }
};

exports.verifyOwnership = (req, res, next) => {
  const userId = Number(req.params.userId);
  if (userId !== req.user.id) {
    return res.status(403).json({ msg: "You don't have access rights" });
  }
  next();
};

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    {
      id: user.id,
      name: user.name,
      username: user.username,
      phone: user.phone,
      email: user.email,
      groups: user.groups,
      createdAt: user.createdAt,
    },
    ACCESS_TOKEN,
    { expiresIn: "10m" }
  );

  const refreshToken = jwt.sign({ id: user.id }, REFRESH_TOKEN, {
    expiresIn: "10d",
  });

  return { accessToken, refreshToken };
};
