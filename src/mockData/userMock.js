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
  debtor: [
    { creditor: { id: 2, name: "Ron" }, amount: 83 },
    { creditor: { id: 1, name: "Harry" }, amount: 2 },
    { creditor: { id: 4, name: "Dumbledore" }, amount: 16 },
  ],
  creditor: [
    { debtor: { id: 3, name: "Hagrid" }, amount: 43 },
    { debtor: { id: 2, name: "Ron" }, amount: 25 },
    { debtor: { id: 1, name: "Harry" }, amount: 10 },
  ],
};

// outdated
// const userbalance = {
//   // you owe to people
//   debtor: [
// { creditorId: 2, amount: 83 },
// { creditorId: 1, amount: 2 },
// { creditorId: 4, amount: 16 },
//   ],
//   // people owe you
//   creditor: [
// { debtorId: 2, amount: 25 },
// { debtorId: 1, amount: 10 },
//   ],
// };

export { userBal, user };
