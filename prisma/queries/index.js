const prisma = require("../../config/prismaClient");
const users = require("./users");

async function main() {
  await prisma.member.createMany({
    data: [
      { memberId: 1, groupId: 1 },
      { memberId: 2, groupId: 1 },
      { memberId: 3, groupId: 1 },
      { memberId: 4, groupId: 1 },
      { memberId: 5, groupId: 1 },
    ],
    skipDuplicates: true, // avoids error if already added
  });

  console.log("Database populated successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
