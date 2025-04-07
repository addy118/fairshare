g(
  createBalance({
    name: "exp1",
    groupId: 1,
    totalAmt: 250,
    payers: [
      { payerId: 2, amount: 200 },
      { payerId: 3, amount: 0 },
      { payerId: 4, amount: 50 },
    ],
  })
);