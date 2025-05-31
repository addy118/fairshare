const { verifyWebhook } = require("@clerk/express/webhooks");

exports.postClerkUser = async (req, res) => {
  try {
    const evt = await verifyWebhook(req);

    const user = evt.data;
    await prisma.user.create({
      data: {
        id: user.id,
        name: user.first_name + user.last_name,
        username: user.username,
        email: user.email_addresses[0].email_address,
        phone: user.phone_numbers?.[0]?.phone_number,
        createdAt: new Date(user.created_at),
        updatedAt: new Date(user.updated_at),
        pfp: user.image_url,
      },
    });

    const eventType = evt.type;
    console.log(
      `Received webhook with ID ${id} and event type of ${eventType}`
    );
    console.log("Webhook payload: ", evt.data);

    res.status(200).send("Webhook verified successfully!");
  } catch (err) {
    console.error("Error verifying webhook: ", err);
    return res.status(400).send("Error verifying webhook");
  }
};
