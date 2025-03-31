const db = require("../config/prismaClient");

const main = async () => {
  const res = db.user.findUnique();
  console.log(res);
};

main();
