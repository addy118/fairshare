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
    } else if (eventType === "user.updated") {
      await User.update(user);
    } else if (eventType === "user.deleted") {
      await User.delete(user);
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
