const db = require("../../config/prismaClient");

const main = async () => {
  const res = await db.user.create({});

  console.log(res);
};

main().catch((e) => console.error(e));
