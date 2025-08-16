export const splits = [
  {
    id: 100,
    debtor: "B",
    creditor: "A",
    amount: 83,
    settled: false,
    confirmed: false,
  },
  {
    id: 101,
    debtor: "C",
    creditor: "A",
    amount: 33,
    settled: false,
    confirmed: false,
  },
  {
    id: 102,
    debtor: "A",
    creditor: "B",
    amount: 25,
    settled: false,
    confirmed: false,
  },
  {
    id: 103,
    debtor: "A",
    creditor: "D",
    amount: 42,
    settled: false,
    confirmed: false,
  },
  {
    id: 104,
    debtor: "A",
    creditor: "C",
    amount: 6,
    settled: false,
    confirmed: false,
  },
  {
    id: 105,
    debtor: "B",
    creditor: "C",
    amount: 16,
    settled: false,
    confirmed: false,
  },
  {
    id: 106,
    debtor: "B",
    creditor: "E",
    amount: 2,
    settled: false,
    confirmed: false,
  },
  {
    id: 107,
    debtor: "E",
    creditor: "B",
    amount: 10,
    settled: false,
    confirmed: false,
  },
];

export const splitsRaw = [
  // exp 1
  ["B", "A", 83],
  ["C", "A", 33],

  // exp 2
  ["A", "B", 25],

  // exp 3
  ["A", "D", 42],
  ["A", "C", 6],
  ["B", "C", 16],
  ["B", "E", 2],

  // exp 4
  ["E", "B", 10],
];
