const prisma = require("../../config/prismaClient");
const Expense = require("./Expense");
const Group = require("./Group");
const Split = require("./Split");
const User = require("./User");
const users = require("./users");

async function main() {
  try {
    let res = await prisma.expense.deleteMany({
      where: { groupId: 10 },
    });

    res = await prisma.group.delete({
      where: { id: 10 },
    });

    console.log(`Deleted group`, res);
  } catch (error) {
    console.error(`Failed to delete group`, error.message);
  }

  console.log("Query execution completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
