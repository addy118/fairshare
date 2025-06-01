const prisma = require("../../config/prismaClient");
const Expense = require("./Expense");
const Group = require("./Group");
const Split = require("./Split");
const User = require("./User");

async function main() {
  try {
    // const res = await Group.create("Demo");
    // const res = await Group.join("user_2xr6Vz2hPcAvh0HmMGacSHaBwsm", 3);
    // const res = await User.groups("user_2xr6Vz2hPcAvh0HmMGacSHaBwsm");
    // const res = await Expense.confirm(80);

    const userId = await prisma.user.findFirst({
      where: { username: "hi" },
      select: { id: true },
    });

    if (!userId) {
      throw new Error("No user found with the given username.");
    }
    console.log(userId);
    console.log(`Query succeeded: `, res);
  } catch (error) {
    console.error(`Query failed: `, error.message);
    throw new Error(error.message);
  } finally {
    console.log("Query execution completed!");
  }
}

main()
  .catch((e) => {
    console.error("Outside error: ", e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
