require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../prisma/queries/User");
const { ACCESS_TOKEN, REFRESH_TOKEN } = process.env;

exports.postSignup = async (req, res) => {
  const { name, username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create(name, username, email, hashedPassword);

  res.status(200).json({ user });
};

exports.postLogin = async (req, res) => {
  const { data, password } = req.body;
  const user = await User.get(data);

  if (!user) return res.status(404).send("User not found!");

  const matched = await bcrypt.compare(password, user.password);
  if (!matched) return res.status(400).send("Invalid password!");

  const { accessToken, refreshToken } = generateTokens(user);

  // send set-cookie header with response
  res.cookie("refreshCookie", refreshToken, {
    httpOnly: true,
    // true in prod (only send over https)
    secure: false,
    samesite: "None",
  });

  try {
    const decoded = jwt.verify(accessToken, ACCESS_TOKEN);
    // send the decoded and raw token to client
    return res.json({ msg: "Login Successful!", accessToken, user: decoded });
  } catch (err) {
    res.status(403).json({ msg: err.message });
  }
};

exports.postLogout = async (req, res) => {
  res.clearCookie("refreshCookie", {
    httpOnly: true,
    secure: false,
    samesite: "None",
  });
  res.status(200).json({ msg: "Logged out successfully" });
};

exports.getToken = async (req, res) => {
  // check access token in header
  const bearerHeader = req.headers["authorization"];
  const accessToken = bearerHeader && bearerHeader.split(" ")[1];
  if (!accessToken)
    return res.status(403).json({ msg: "Invalid or expired token" });

  try {
    // verify the token
    const decoded = jwt.verify(accessToken, ACCESS_TOKEN);
    // send the decoded and raw token to client
    // console.log({ accessToken, user: decoded });
    return res.json({ accessToken, user: decoded });
  } catch (err) {
    res.status(403).json({ msg: err.message });
  }
};

exports.verifyToken = (req, res, next) => {
  // extract access token from header
  const bearerHeader = req.headers["authorization"];
  const accessToken = bearerHeader && bearerHeader.split(" ")[1];
  if (!accessToken) return res.status(500).send("Unauthorized access!");

  // verify it and proceed
  try {
    const decoded = jwt.verify(accessToken, ACCESS_TOKEN);
    req.user = decoded;
    next();
  } catch (err) {
    console.error(err.message);
    res.status(403).json({ msg: "Invalid or expired token" });
  }
};

exports.refresh = async (req, res) => {
  // verify the refresh token from cookie
  // console.log("from refresh");
  const refreshCookie = req.cookies.refreshCookie;

  if (!refreshCookie) {
    return res.status(401).json({ msg: "Unauthorized: No Token Found" });
  }

  try {
    // console.log(refreshCookie);
    const decoded = jwt.verify(refreshCookie, REFRESH_TOKEN);
    const user = await User.getById(decoded.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    res.cookie("refreshCookie", refreshToken, {
      httpOnly: true,
      // true in prod (only send over https)
      secure: false,
      samesite: "None",
    });

    res.json({ msg: "Tokens Regenerated", accessToken });
  } catch (error) {
    return res.status(403).json({ msg: "Invalid or expired token" });
  }
};

exports.verifyOwnership = (req, res, next) => {
  const userId = Number(req.params.userId);
  if (userId !== req.user.id)
    return res.status(403).json({ msg: "You don't have access rights" });

  next();
};

const generateTokens = (user) => {
  // sign access token
  const accessToken = jwt.sign(
    {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
    },
    ACCESS_TOKEN,
    { expiresIn: "10m" }
  );

  //   "accessToken": {
  //     "id": 1,
  //     "name": "addy",
  //     "username": "addy118",
  //     "email": "addy@test.com",
  //     "iat": 1742489157,
  //     "exp": 1742489757
  // }

  // sign refresh token
  const refreshToken = jwt.sign({ id: user.id }, REFRESH_TOKEN, {
    expiresIn: "10d",
  });

  // "refreshToken": {
  //   "id": 1,
  //   "iat": 1742489157,
  //   "exp": 1742489757,
  // }

  return { accessToken, refreshToken };
};
