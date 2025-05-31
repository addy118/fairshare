require("dotenv").config();
const { createClerkClient } = require("@clerk/express");
const { isSignedIn } = require("@clerk/express");
const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN, REFRESH_TOKEN } = process.env;
const { CLERK_SECRET_KEY, CLERK_PUBLISHABLE_KEY } = process.env;

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

exports.authMiddleware = async (req, res) => {
  const clerkClient = createClerkClient({
    secretKey: CLERK_SECRET_KEY,
    publishableKey: CLERK_PUBLISHABLE_KEY,
  });
};
