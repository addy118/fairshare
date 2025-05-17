const { body } = require("express-validator");

exports.validateSignup = [
  body("name")
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("Name should be between 3 and 20 characters!"),
  // .matches(/^[a-zA-Z]+$/)
  // .withMessage("Name should only contain letters, numbers, and underscores!"),

  body("username")
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("Username should be between 3 and 20 characters!"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address!"),

  body("password")
    .trim()
    // .isLength({ min: 6 })
    // .withMessage("Password should be at least 6 characters long!"),
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[@$!%*?&]/)
    .withMessage(
      "Password must contain at least one special character (@$!%*?&)"
    ),
];

exports.validateLogin = [
  body("data").trim(),

  body("password")
    .trim()
    // .isLength({ min: 6 })
    // .withMessage("Password should be at least 6 characters long!"),
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[@$!%*?&]/)
    .withMessage(
      "Password must contain at least one special character (@$!%*?&)"
    ),
];

// exports.validateBio = [
//   body("bio")
//     .optional()
//     .trim()
//     .isLength({ max: 300 })
//     .withMessage("Bio must be at most 300 characters"),
// ];

exports.validateName = [
  body("name")
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("Name should be between 3 and 20 characters!"),
  // .matches(/^[a-zA-Z]+$/)
  // .withMessage("Name should only contain letters, numbers, and underscores!"),
];

exports.validateEmail = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address!"),
];

exports.validatePass = [
  body("password")
    .trim()
    // .isLength({ min: 6 })
    // .withMessage("Password should be at least 6 characters long!"),
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[@$!%*?&]/)
    .withMessage(
      "Password must contain at least one special character (@$!%*?&)"
    ),
];
