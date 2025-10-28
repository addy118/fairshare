import { Controller } from "types";

export function catchAsync(cb: Controller): Controller {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error: unknown) {
      if (error instanceof Error) {
        next(error);
      } else {
        next(new Error(String(error)));
      }
    }
  };
}
