const prisma = require("../../config/prismaClient");

const main = async () => {
  const res = await prisma.expense.deleteMany({});

  console.log(res);
};

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
