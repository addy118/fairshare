const db = require("../../config/prismaClient");

const main = async () => {
  const res = await db.group.create({
    data: { name: "Hogwarts" },
  });

  console.log(res);
};

main().catch((e) => console.error(e));
