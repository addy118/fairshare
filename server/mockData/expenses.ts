import { RawExpense } from "types";

export const expensesOld: RawExpense[] = [
  {
    name: "exp1",
    groupId: 1,
    totalAmt: 250,
    payers: [
      { name: "A", payerId: "A", amount: 200 },
      { name: "B", payerId: "B", amount: 0 },
      { name: "C", payerId: "C", amount: 50 },
    ],
  },
  {
    name: "exp2",
    groupId: 1,
    totalAmt: 50,
    payers: [
      { name: "A", payerId: "A", amount: 0 },
      { name: "B", payerId: "B", amount: 50 },
    ],
  },
  {
    name: "exp3",
    groupId: 1,
    totalAmt: 290,
    payers: [
      { name: "A", payerId: "A", amount: 10 },
      { name: "B", payerId: "B", amount: 40 },
      { name: "C", payerId: "C", amount: 80 },
      { name: "D", payerId: "D", amount: 100 },
      { name: "E", payerId: "E", amount: 60 },
    ],
  },
  {
    name: "exp4",
    groupId: 1,
    totalAmt: 60,
    payers: [
      { name: "B", payerId: "B", amount: 30 },
      { name: "C", payerId: "C", amount: 20 },
      { name: "E", payerId: "E", amount: 10 },
    ],
  },
];

export const expenses: RawExpense[] = [
  // Expense 1: Group Vacation Booking
  {
    name: "Vacation Booking",
    groupId: 1,
    totalAmt: 600,
    payers: [
      { name: "A", payerId: "A", amount: 300 },
      { name: "B", payerId: "B", amount: 250 },
      { name: "C", payerId: "C", amount: 50 },
      { name: "D", payerId: "D", amount: 0 },
      { name: "E", payerId: "E", amount: 0 },
    ],
  },
  // Expense 2: Shared Project Supplies
  {
    name: "Project Supplies",
    groupId: 1,
    totalAmt: 400,
    payers: [
      { name: "C", payerId: "C", amount: 200 },
      { name: "D", payerId: "D", amount: 200 },
      { name: "B", payerId: "B", amount: 0 },
      { name: "E", payerId: "E", amount: 0 },
    ],
  },
  // Expense 3: Weekend Trip
  {
    name: "Weekend Trip",
    groupId: 1,
    totalAmt: 500,
    payers: [
      { name: "E", payerId: "E", amount: 400 },
      { name: "A", payerId: "A", amount: 100 },
      { name: "B", payerId: "B", amount: 0 },
      { name: "C", payerId: "C", amount: 0 },
    ],
  },
  // Expense 4: NEW - Adds one more naive split
  // B pays for lunch for C.
  {
    name: "Quick Lunch",
    groupId: 1,
    totalAmt: 30,
    payers: [
      { name: "B", payerId: "B", amount: 30 },
      { name: "C", payerId: "C", amount: 0 },
    ],
  },
];

// { A: 44, B: -66, C: -11, D: 42, E: -8 }

const splits = [
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

export const optiSplits = [
  ["B", "A", 44],
  ["B", "D", 22],
  ["C", "D", 11],
  ["E", "D", 8],
];

module.exports = { expenses, optiSplits, splits };
