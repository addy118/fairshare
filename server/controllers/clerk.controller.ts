import { verifyWebhook } from "@clerk/express/webhooks";
import User from "../queries/User";
import { ClerkEvent, Controller } from "../types";
import { catchAsync } from "middleware/catchAsync";

export const postClerkUser: Controller = catchAsync(async (req, res) => {
  const evt = (await verifyWebhook(req)) as ClerkEvent;

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
});
