const db = require("../../config/prismaClient");

const main = async () => {
  for (let i = 45; i <= 48; i++) {
    await db.split.delete({
      where: { id: i },
    });
  }

  // console.log(res);
};

main().catch((e) => console.error(e));
