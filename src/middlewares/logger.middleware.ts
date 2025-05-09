import { NextFunction, Request, Response } from "express";

export const logger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const log = `${req.method} ${req.url} ${res.statusCode} ${req.headers["user-agent"]} ${new Date().toISOString()} `;

  if (res.statusCode >= 400) {
    // eslint-disable-next-line no-console
    console.error(log);
  } else {
    // eslint-disable-next-line no-console
    console.log(log);
  }
  next();
};
