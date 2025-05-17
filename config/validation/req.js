const { validationResult } = require("express-validator");

exports.validateReq = (req, res, next) => {
  // form validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }

  next();
};
