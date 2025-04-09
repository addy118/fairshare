const getExp = {
  exp: {
    id: 3,
    name: "exp3",
    groupId: 1,
    totalAmt: 290,
    payers: [
      { payerId: 1, paidAmt: 60 },
      { payerId: 5, paidAmt: 100 },
      { payerId: 4, paidAmt: 80 },
      { payerId: 3, paidAmt: 40 },
      { payerId: 2, paidAmt: 10 },
    ],
    splits: [
      { debtorId: 3, creditorId: 1, amount: 2, settled: false },
      { debtorId: 3, creditorId: 4, amount: 16, settled: false },
      { debtorId: 2, creditorId: 4, amount: 6, settled: false },
      { debtorId: 2, creditorId: 5, amount: 42, settled: false },
    ],
    _count: { payers: 5, splits: 4 },
  },
};
