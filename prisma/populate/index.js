const prisma = require("../../config/prismaClient");

const main = async () => {
  const res = await prisma.user.findFirst({
    where: { id: 3 },
    select: {
      // amount to be debited
      debtor: {
        select: { creditorId: true, amount: true },
      },
      // amount to get credited
      creditor: {
        select: { debtorId: true, amount: true },
      },
    },
  });

  console.log(res);
};

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
