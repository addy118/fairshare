const prisma = require("../../config/prismaClient");

const main = async () => {
  const exp1 = await prisma.expense.create({
    data: {
      name: "exp1",
      groupId: 1,
      totalAmt: 250,
      payers: {
        create: [
          { payerId: 2, paidAmt: 200 },
          { payerId: 4, paidAmt: 50 },
        ],
      },
      splits: {
        create: [
          { name: "exp1", debtorId: 3, creditorId: 2, amount: 83, groupId: 1 },
          { name: "exp1", debtorId: 4, creditorId: 2, amount: 33, groupId: 1 },
        ],
      },
    },
  });

  const exp2 = await prisma.expense.create({
    data: {
      name: "exp2",
      groupId: 1,
      totalAmt: 50,
      payers: {
        create: [{ payerId: 3, paidAmt: 50 }],
      },
      splits: {
        create: [
          { name: "exp2", debtorId: 2, creditorId: 3, amount: 25, groupId: 1 },
        ],
      },
    },
  });

  const exp3 = await prisma.expense.create({
    data: {
      name: "exp3",
      groupId: 1,
      totalAmt: 290,
      payers: {
        create: [
          { payerId: 2, paidAmt: 10 },
          { payerId: 3, paidAmt: 40 },
          { payerId: 4, paidAmt: 80 },
          { payerId: 5, paidAmt: 100 },
          { payerId: 6, paidAmt: 60 },
        ],
      },
      splits: {
        create: [
          { name: "exp3", debtorId: 2, creditorId: 5, amount: 42, groupId: 1 },
          { name: "exp3", debtorId: 2, creditorId: 4, amount: 4, groupId: 1 },
          { name: "exp3", debtorId: 2, creditorId: 6, amount: 2, groupId: 1 },
          { name: "exp3", debtorId: 3, creditorId: 4, amount: 18, groupId: 1 },
        ],
      },
    },
  });

  const exp4 = await prisma.expense.create({
    data: {
      name: "exp4",
      groupId: 1,
      totalAmt: 60,
      payers: {
        create: [
          { payerId: 3, paidAmt: 30 },
          { payerId: 4, paidAmt: 20 },
          { payerId: 6, paidAmt: 10 },
        ],
      },
      splits: {
        create: [
          { name: "exp4", debtorId: 6, creditorId: 3, amount: 10, groupId: 1 },
        ],
      },
    },
  });

  console.log("Expenses added successfully");
  console.log(exp1);
  console.log(exp2);
  console.log(exp3);
  console.log(exp4);
};

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
