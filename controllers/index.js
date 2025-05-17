const Group = require("../prisma/queries/Group");
const User = require("../prisma/queries/User");
const { getSplitBalance, mergeChrono, getGroupBalance } = require("./util");



(async () => {
  console.log(await getGroupBalance(1));
})();
