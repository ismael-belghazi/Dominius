import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
  status?: number;
}

export default function errorHandler(
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) {

  const status = err.status || 500;

  console.error("ERROR:", {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  res.status(status).json({
    success: false,
    error: status === 500 ? "Internal Server Error" : err.message
  });

}