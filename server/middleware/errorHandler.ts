import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { handlePrismaError } from "../utils";
import AppError from "../utils/AppError";

export const globalHandler = async (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let currError = error;

  if (
    currError instanceof Prisma.PrismaClientKnownRequestError ||
    currError instanceof Prisma.PrismaClientValidationError
  ) {
    try {
      handlePrismaError(currError, req.originalUrl);
    } catch (newError) {
      currError = newError;
    }
  }

  if (currError instanceof AppError) {
    console.log("app error instance");
    console.log(`Error in ${currError.context}: `, currError.message);
    res
      .status(currError.statusCode)
      .json({ message: currError.message || "Something went wrong" });
  } else if (currError instanceof Error) {
    console.log(currError.stack);
    res.status(500).json({ message: "Something went wrong" });
  } else {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
