// addy(id: 2), hermione(id: 3), harry(id: 4), ron(id: 5), draco(id: 6)
// group: hogwarts (id: 1)
const group = {
  exp1: {
    addy: 200, // 117
    hermione: 0, // -83 (addy)
    harry: 50, // -33 (addy)
  },
  exp2: {
    addy: 0, // -25 (hermione)
    hermione: 50, // 25
  },
  exp3: {
    addy: 10, // -48 (harry, ron, draco)
    hermione: 40, // -18 (harry)
    harry: 80, // 22
    ron: 100, // 42
    draco: 60, // 2
  },
  exp4: {
    hermione: 30, // 10
    harry: 20, // 0
    draco: 10, // -10 (hermione)
  },
};

// addy -> hermione (25), harry (4), ron (42), draco (2)
// hermione -> addy (83), harry (18)
// harry -> addy (33)
// ron -> null
// draco -> hermione (10)

// minimize trans
// addy -> ron (42), draco (2)
// hermione -> addy (58), harry (18)
// harry -> addy (29)
// draco -> hermione (10)
