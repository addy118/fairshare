const prisma = require("../../config/prismaClient");

const main = async () => {
  await prisma.member.createMany({
    data: [
      { memberId: 2, groupId: 1 }, // addy
      { memberId: 3, groupId: 1 }, // hermione
      { memberId: 4, groupId: 1 }, // harry
      { memberId: 5, groupId: 1 }, // ron
      { memberId: 6, groupId: 1 }, // draco
    ],
    skipDuplicates: true,
  });

  console.log("Users added to group 1 successfully");
};

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
