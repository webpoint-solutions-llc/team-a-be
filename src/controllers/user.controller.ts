import { NextFunction, Request, Response } from "express";
import { getHashedPassword, validatePassword } from "../utils/password";
import * as generator from "../utils/generator";
import { nodeEnv } from "../config";
import prisma from "../db/prisma";
import * as response from "../utils/response";
import { ZodError } from "zod";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password, fullName } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return response.errorResponse(res, "Email already exists.");
    }

    const hashedPassword = await getHashedPassword(password);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
      },
    });

    return response.successResponse(res, "User registered successfully.", {
      id: newUser.id,
      email: newUser.email,
      fullName: newUser.fullName,
    });
  } catch (error) {
    console.error(error);
    return response.errorResponse(res, "Internal server error.");
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return response.errorResponse(res, "Invalid email or password.");
    }

    const isPasswordValid = await validatePassword(password, user.password);
    if (!isPasswordValid) {
      return response.errorResponse(res, "Invalid email or password.");
    }

    const token = generator.generateJwt(user.email, user.id);

    return response.successResponse(res, "Logged in successfully.", {
      token,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return response.zodErrorResponse(res, error);
    }
    return response.errorResponse(res, "Internal server error.");
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.clearCookie("token");
    return response.successResponse(res, "Logged out successfully.");
  } catch (error) {
    console.error(error);
    return response.errorResponse(res, "Internal server error.");
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return response.errorResponse(res, "Unauthorized.");
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return response.errorResponse(res, "User not found.");
    }

    return response.successResponse(res, "User profile fetched.", {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
    });
  } catch (error) {
    console.error(error);
    return response.errorResponse(res, "Internal server error.");
  }
};
