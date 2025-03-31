const db = require("../config/prismaClient");

const main = async () => {
  const res = await db.user.deleteMany();
  console.log(res);
};

main();
