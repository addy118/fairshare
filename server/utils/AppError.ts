class AppError extends Error {
  public statusCode: number;
  public context: string;

  constructor(message: string, statusCode: number, context?: string) {
    super(message);
    this.statusCode = statusCode;

    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);

    if (!context) {
      const stack = this.stack?.split("\n")[1]?.trim();
      this.context = stack || "Unknown context";
    } else {
      this.context = context;
    }
  }
}

export default AppError;
