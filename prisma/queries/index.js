const prisma = require("../../config/prismaClient");
const Group = require("./Group");
const User = require("./User");
const users = require("./users");

async function main() {
  const res = await Group.splitsHistory(1);
  console.log(res);

  console.log("Successful!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
