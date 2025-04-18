const { transporter } = require("../config/nodeMailer");

const split = {
  id: 26,
  name: "test",
  groupId: 1,
  expenseId: 6,
  debtor: {
    id: 1,
    name: "Harry",
    email: "harry@hogwarts.edu",
    phone: "+919999999912",
    username: "harry",
  },
  creditor: {
    id: 2,
    name: "Hermione",
    email: "hermione@hogwarts.edu",
    phone: "+919999999911",
    username: "hermione",
  },
  amount: 5,
  settled: false,
  confirmed: false,
};

const to = split.creditor;
const from = split.debtor;

const mailOptions = {
  from: "addyyy118@gmail.com",
  to: from.email,
  subject: "Payment Reminder",
  html: `<p>Hello <strong>${from.name}</strong>!</p>
    <p>You need to pay <strong>₹${split.amount}</strong> to <strong>${to.name}</strong>.</p>
    <p>Thanks,<br/>FairShare Team</p>`,
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error("Error sending email:", error);
    // res.status().json({ msg: "Error sending reminder mail." });
  } else {
    console.log("Email sent:", info.response);
    // res.status(200).json({ msg: "Reminder email was sent successfully!" });
  }
});
