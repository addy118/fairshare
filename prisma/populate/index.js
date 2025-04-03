const prisma = require("../../config/prismaClient");

const minSplits = [
  { name: "Optimized Split", groupId: 1, debtorId: 3, creditorId: 2, amount: 43 }, 
  { name: "Optimized Split", groupId: 1, debtorId: 3, creditorId: 5, amount: 23 }, 
  { name: "Optimized Split", groupId: 1, debtorId: 4, creditorId: 5, amount: 11 }, 
  { name: "Optimized Split", groupId: 1, debtorId: 6, creditorId: 5, amount: 8 }
];

const main = async () => {
  const res = await prisma.split.createManyAndReturn({
      data: minSplits,
    });

  console.log(res);
};

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
