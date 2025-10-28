import { Prisma } from "@prisma/client";
import AppError from "../utils/AppError";

export function handlePrismaError(
  error: unknown,
  context: string = "Prisma Query"
): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        const target = (error.meta?.target as string[])?.join(", ") || "field";
        throw new AppError(
          `Duplicate ${target} value violates unique constraint`,
          409,
          context
        );
      case "P2025":
        throw new AppError("Record not found", 404, context);
      case "P2003":
        throw new AppError("Foreign key constraint failed", 400, context);
      case "P1001":
        throw new AppError("Database connection failed", 503, context);
      default:
        throw new AppError(
          `Unhandled Prisma error: ${error.message}`,
          500,
          context
        );
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError)
    throw new AppError(
      error.message || "Invalid data provided to Prisma",
      400,
      context
    );

  if (error instanceof Error) {
    throw new AppError(error.message, 500, context);
  }

  throw new AppError("Unexpected database error", 500, context);
}
