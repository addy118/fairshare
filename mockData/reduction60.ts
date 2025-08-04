import { RawExpense } from "types";

export const expenses: RawExpense[] = [
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

const balances = [
  // exp 1
  { A: 180, B: 130, C: -70, D: -120, E: -120 },
  // exp 2
  { C: 100, D: 100, B: -100, E: -100 },
  // exp 3
  { E: 275, A: -25, B: -125, C: -125 },
  // exp 4
  { B: 15, C: -15 },
];

// total = 10
export const initSpits = [
  // exp 1
  ["D", "A", 120],
  ["E", "A", 60],
  ["E", "B", 60],
  ["C", "B", 70],

  // exp 2
  ["B", "C", 100],
  ["E", "D", 100],

  // exp 3
  ["B", "E", 125],
  ["C", "E", 125],
  ["A", "E", 25],

  // exp 4
  ["C", "B", 15],
];

// total = 4
export const optiBal = { A: 155, B: -80, C: -110, D: -20, E: 55 };
export const optiSplits = [
  ["C", "A", 110],
  ["B", "A", 45],
  ["B", "E", 35],
  ["D", "E", 20],
];

const reduction =
  ((initSpits.length - optiSplits.length) / initSpits.length) * 100;
