const prisma = require("../../config/prismaClient");
const Group = require("../queries/Group");

const main = async () => {
  const res = await Group.expenseHistory(1);

  console.log(res);
};

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
