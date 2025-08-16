import User from "../queries/User";
import prisma from "../config/prismaClient";

async function main() {
  try {
    // const res = await Group.create("Demo");
    // const res = await Group.join("user_2xr6Vz2hPcAvh0HmMGacSHaBwsm", 3);
    // const res = await User.groups("user_2xr6Vz2hPcAvh0HmMGacSHaBwsm");
    // const res = await Expense.confirm(80);

    const res = await User.balance("user_2xz2HcTZUwAzLRyOAGp5jwuZl4z");

    console.log(res);

  } catch (error) {
    if (error instanceof Error) {
      console.error(`Query failed: `, error.message);
      throw new Error(error.message);
    }
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

// // delete db entirely
// (async () => {
//   try {
//     await prisma.split.deleteMany();
//     await prisma.expense.deleteMany();
//     await prisma.payer.deleteMany();
//     await prisma.member.deleteMany();
//     await prisma.group.deleteMany();
//     await prisma.user.deleteMany();

//     console.log(`Database deletion succeeded!`);
//   } catch (error) {
//     console.error(`Database deletion failed: `, error.message);
//     throw new Error(error.message);
//   } finally {
//     console.log("Query execution completed!");
//   }
// })();
