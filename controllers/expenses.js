const expenses = [
  {
    name: "exp1",
    groupId: 1,
    totalAmt: 250,
    payers: [
      { name: "A", payerId: 2, amount: 200 },
      { name: "B", payerId: 3, amount: 0 },
      { name: "C", payerId: 4, amount: 50 },
    ],
  },
  {
    name: "exp2",
    groupId: 1,
    totalAmt: 50,
    payers: [
      { name: "A", payerId: 2, amount: 0 },
      { name: "B", payerId: 3, amount: 50 },
    ],
  },
  {
    name: "exp3",
    groupId: 1,
    totalAmt: 290,
    payers: [
      { name: "A", payerId: 2, amount: 10 },
      { name: "B", payerId: 3, amount: 40 },
      { name: "C", payerId: 4, amount: 80 },
      { name: "D", payerId: 5, amount: 100 },
      { name: "E", payerId: 6, amount: 60 },
    ],
  },
  {
    name: "exp4",
    groupId: 1,
    totalAmt: 60,
    payers: [
      { payerId: 3, amount: 30 },
      { payerId: 4, amount: 20 },
      { payerId: 6, amount: 10 },
    ],
  },
];

const exp3 = {
  name: "exp3",
  groupId: 1,
  totalAmt: 290,
  payers: [
    { name: "A", payerId: 2, amount: 10 },
    { name: "C", payerId: 4, amount: 80 },
    { name: "B", payerId: 3, amount: 40 },
    { name: "D", payerId: 5, amount: 100 },
    { name: "E", payerId: 6, amount: 60 },
  ],
};

// balance = { "A": -48, "B": 22, "C": -18, "D": 42, "E": 2 }
const split = [
  // [u, v, w]
  ["B", "C", 18],
  ["A", "C", 4],
  ["A", "D", 42],
  ["A", "E", 2],
];

const splits = [
  ["B", "A", 83],
  ["C", "A", 33],
  ["A", "B", 25],
  ["A", "D", 42],
  ["A", "C", 6],
  ["B", "C", 16],
  ["B", "E", 2],
  ["E", "B", 10],
];

module.exports = { expenses, exp3, splits };
