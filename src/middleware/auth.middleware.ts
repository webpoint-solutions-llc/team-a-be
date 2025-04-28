import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const auth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ error: "Authentication token missing" });
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({ error: "Authentication token missing" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    (req as JwtPayload).user = decoded;

    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
