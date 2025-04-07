const users = [
  // the password is Hello@18
  {
    name: "Addy",
    username: "addy",
    email: "addy@hogwarts.edu",
    phone: "+919999999910",
    password: "$2a$10$9EQLAgAg2ukcOF/PiOb4fOKke8eDNsh9mJC55wy02JB3bd9HNsrda",
  },
  {
    name: "Hermione",
    username: "hermione",
    email: "hermione@hogwarts.edu",
    phone: "+919999999911",
    password: "$2a$10$VDVj7xNGDkeqOuH318NQr.FkXGKsulT1bLXdUvFAB8SyDAUKQpedy",
  },
  {
    name: "Harry",
    username: "harry",
    email: "harry@hogwarts.edu",
    phone: "+919999999912",
    password: "$2a$10$52dOcPJ4bcnDrFEaZMek5u9.K69ZPH2g9KwVsMWF8TtCAMtq3Yd4y",
  },
  {
    name: "Ron",
    username: "ron",
    email: "ron@hogwarts.edu",
    phone: "+919999999913",
    password: "$2a$10$6AKaGD/bAyzJs.t1XU/tle4qPEtFDUrfxpTRb6sqAZunPI6epGLBO",
  },
  {
    name: "Draco",
    username: "draco",
    email: "draco@hogwarts.edu",
    phone: "+919999999914",
    password: "$2a$10$LM7LeY06XFfaMwOUNe5MGuzy0UdWNY.H5KkD4VwEv3KhMsgjeNbEm",
  },
  {
    name: "Dumbledore",
    username: "dumble",
    email: "dumble@hogwarts.edu",
    phone: "+919999999915",
    password: "$2a$10$Rf7BJ.gF1l5GQ7A6EJgEcOBplMWZeRB522dcavaDLVl4P.rCInEIy",
  },
  {
    name: "Snape",
    username: "snape",
    email: "snape@hogwarts.edu",
    phone: "+919999999916",
    password: "$2a$10$U9/F5GfwYjbASLaX5Ftbs.BbPyxjywpAYL763vL3wIXE.SwLh.mKe",
  },
  {
    name: "McGonagall",
    username: "minerva",
    email: "minerva@hogwarts.edu",
    phone: "+919999999917",
    password: "$2a$10$/QJNXdsqRSZWR67AgOo5WenaUoooua/AHBlCp1bafiCwp.2ubifSO",
  },
  {
    name: "Hagrid",
    username: "hagrid",
    email: "hagrid@hogwarts.edu",
    phone: "+919999999918",
    password: "$2a$10$Vo9QfrIxjw9Wv6JTRxTy3uxOJlw10y7tEUgTONorv761Dxdw5EFem",
  },
  {
    name: "Voldemort",
    username: "voldy",
    email: "voldy@hogwarts.edu",
    phone: "+919999999919",
    password: "$2a$10$WmZoKoveYsDu1Sz/N61rleymXOb/yLzHXXHlbZU78M9kpgEnOaphm",
  },
];

users.forEach(async (user, i) => {
  const res = await db.user.create({
    data: {
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      password: user.password,
    },
  });

  console.log(res);
});
