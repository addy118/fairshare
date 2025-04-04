const prisma = require("../../config/prismaClient");

const main = async () => {
  // await prisma.member.create({
  //   data: { memberId: 8, groupId: 1 },
  // });
  await prisma.member.delete({
    where: {
      groupId_memberId: {
        groupId: Number(1),
        memberId: Number(8),
      },
    },
  });

  console.log("User added to group 1 successfully");
};

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
