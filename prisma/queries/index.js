const prisma = require("../../config/prismaClient");
const Expense = require("./Expense");
const Group = require("./Group");
const Split = require("./Split");
const User = require("./User");
const users = require("./users");

async function main() {
  try {
    let res = await prisma.user.deleteMany({});

    console.log(`Query succeeded: `, res);
  } catch (error) {
    console.error(`Query failed: `, error.message);
  } finally {
    console.log("Query execution completed!");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
