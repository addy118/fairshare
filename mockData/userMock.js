const user = {
  id: 2,
  name: "Hermione",
  username: "hermione",
  email: "hermione@hogwarts.edu",
  phone: "+919999999911",
  createdAt: "2025-04-08T03:14:27.309Z",
  updatedAt: "2025-04-08T03:14:27.309Z",
};

// user id = 3
const userBal = {
  debtor: [],
  creditor: [{ debtor: { id: 3, name: "Hagrid" }, amount: 43 }],
};

// outdated
// const userbalance = {
//   // you owe to people
//   debtor: [
//     { creditorId: 2, amount: 83 },
//     { creditorId: 1, amount: 2 },
//     { creditorId: 4, amount: 16 },
//   ],
//   // people owe you
//   creditor: [
//     { debtorId: 2, amount: 25 },
//     { debtorId: 1, amount: 10 },
//   ],
// };
