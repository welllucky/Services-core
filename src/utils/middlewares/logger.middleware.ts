import { Request, Response } from "express";

export const LoggerMiddleware = (
  req: Request,
  res: Response,
  next: () => void,
) => {
  const log = `${req.method} ${req.url} ${res.statusCode} ${req.headers["user-agent"]} ${new Date().toISOString()} `;

  if (res.statusCode >= 400) {
    console.error(log);
  } else {
    console.log(log);
  }
  next();
};
