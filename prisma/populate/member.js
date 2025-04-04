const prisma = require("../../config/prismaClient");

const main = async () => {
  const isMember = await prisma.member.findUnique({
    where: {
      groupId_memberId: {
        groupId: Number(1),
        memberId: Number(6),
      },
    },
  });

  console.log(isMember);
};

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
