const prisma = require("../../config/prismaClient");
const Expense = require("./Expense");
const Group = require("./Group");
const Split = require("./Split");
const User = require("./User");
const users = require("./users");

async function main() {
  const res = await Split.get(26);
  console.log(res);

  console.log("Query successful!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
