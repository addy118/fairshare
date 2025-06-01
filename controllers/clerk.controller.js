const { verifyWebhook } = require("@clerk/express/webhooks");
const db = require("../config/prismaClient");
const User = require("../prisma/queries/User");

exports.postClerkUser = async (req, res) => {
  try {
    const evt = await verifyWebhook(req);
    const user = evt.data;
    const eventType = evt.type;

    // console.log(
    //   `Received webhook with ID ${user.id} and event type of ${eventType}`
    // );

    if (eventType === "user.created") {
      await User.create(user);
      // try {
      //   await db.user.create({
      //     data: {
      //       id: user.id,
      //       name: `${user.first_name} ${user.last_name}`,
      //       username: user.username,
      //       email: user.email_addresses[0].email_address,
      //       createdAt: new Date(user.created_at),
      //       updatedAt: new Date(user.updated_at),
      //       pfp: user.image_url,
      //     },
      //   });
      // } catch (error) {
      //   console.error("Error creating user: ", error.stack);
      //   if (error.code === "P2002") {
      //     // Handling unique constraint violation
      //     throw new Error(
      //       "A user with this email, phone or username already exists."
      //     );
      //   }
      //   throw new Error("Failed to create user.");
      // }
    } else if (eventType === "user.updated") {
      await User.update(user);
      // try {
      //   await db.user.update({
      //     where: { id: user.id },
      //     data: {
      //       name: `${user.first_name} ${user.last_name}`,
      //       username: user.username,
      //       email: user.email_addresses[0].email_address,
      //       updatedAt: new Date(user.updated_at),
      //       pfp: user.image_url,
      //     },
      //   });
      // } catch (error) {
      //   console.error("Error updating user:", error);
      // }
    } else if (eventType === "user.deleted") {
      await User.delete(user);
      // try {
      //   await db.user.delete({
      //     where: { id: user.id },
      //   });
      // } catch (error) {
      //   console.error("Error deleting user:", error);
      // }
    }

    res.status(200).json({ msg: "Webhook processed successfully!" });
  } catch (error) {
    console.error("Error verifying webhook:", error.message);
    console.error(error.stack);
    return res
      .status(400)
      .json({ message: error.message || "Error verifying webhook" });
  }
};
