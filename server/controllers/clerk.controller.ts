import { verifyWebhook } from "@clerk/express/webhooks";
import User from "../queries/User";
import { Request, Response } from "express";
import { ClerkEvent } from "../types";

export const postClerkUser = async (
  req: Request,
  res: Response
): Promise<void | undefined> => {
  try {
    const evt = (await verifyWebhook(req)) as ClerkEvent;

    // console.log(
    //   `Received webhook with ID ${user.id} and event type of ${eventType}`
    // );

    switch (evt.type) {
      case "user.created":
        await User.create(evt.data);
        break;
      case "user.updated":
        await User.update(evt.data);
        break;
      case "user.deleted":
        await User.delete(evt.data);
        break;
    }

    res.status(200).json({ msg: "Webhook processed successfully!" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error verifying webhook:", error.message);
      console.error(error.stack);
      res
        .status(400)
        .json({ message: error.message || "Error verifying webhook" });
    }
  }
};
