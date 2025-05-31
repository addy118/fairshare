const { verifyWebhook } = require("@clerk/express/webhooks");
const db = require("../config/prismaClient");

exports.postClerkUser = async (req, res) => {
  try {
    const evt = await verifyWebhook(req);
    const user = evt.data;
    const eventType = evt.type;

    console.log(
      `Received webhook with ID ${user.id} and event type of ${eventType}`
    );

    if (eventType === "user.created") {
      try {
        await db.user.create({
          data: {
            id: user.id,
            name: `${user.first_name} ${user.last_name}`,
            username: user.username,
            email: user.email_addresses[0].email_address,
            createdAt: new Date(user.created_at),
            updatedAt: new Date(user.updated_at),
            pfp: user.image_url,
          },
        });
      } catch (error) {
        console.error("Error creating user: ", error.stack);
        if (error.code === "P2002") {
          // Handling unique constraint violation
          throw new Error(
            "A user with this email, phone or username already exists."
          );
        }
        throw new Error("Failed to create user.");
      }
    } else if (eventType === "user.updated") {
      try {
        await db.user.update({
          where: { id: user.id },
          data: {
            name: `${user.first_name} ${user.last_name}`,
            username: user.username,
            email: user.email_addresses[0].email_address,
            updatedAt: new Date(user.updated_at),
            pfp: user.image_url,
          },
        });
      } catch (err) {
        console.error("Error updating user:", err);
      }
    } else if (eventType === "user.deleted") {
      try {
        await db.user.delete({
          where: { id: user.id },
        });
      } catch (err) {
        console.error("Error deleting user:", err);
      }
    }

    res.status(200).send("Webhook processed successfully!");
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return res.status(400).send("Error verifying webhook");
  }
};
