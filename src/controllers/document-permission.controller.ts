import { Request, Response, NextFunction } from "express";
import prisma from "../db/prisma";
import * as response from "../utils/response";

export const addDocumentPermission = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { documentId, userId } = req.body;

    const existingPermission = await prisma.documentPermission.findUnique({
      where: {
        documentId_userId: {
          documentId,
          userId,
        },
      },
    });

    if (existingPermission) {
      return response.errorResponse(
        res,
        "Permission already exists for this user on this document."
      );
    }

    const documentPermission = await prisma.documentPermission.create({
      data: {
        documentId,
        userId,
      },
    });

    return response.successResponse(
      res,
      "Document permission added successfully.",
      { documentPermission }
    );
  } catch (error) {
    console.error(error);
    response.errorResponse(res, "Internal server error.");
  }
};

// Get all permissions for a document
export const getDocumentPermissions = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { documentId } = req.params;

    const permissions = await prisma.documentPermission.findMany({
      where: { documentId },
      include: {
        user: true, // Include user details
      },
    });

    if (permissions.length === 0) {
      return response.errorResponse(
        res,
        "No permissions found for this document."
      );
    }

    return response.successResponse(
      res,
      "Document permissions fetched successfully.",
      { permissions }
    );
  } catch (error) {
    console.error(error);
    response.errorResponse(res, "Internal server error.");
  }
};

// Remove a permission from a document
export const removeDocumentPermission = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { documentId, userId } = req.params;

    const documentPermission = await prisma.documentPermission.findUnique({
      where: {
        documentId_userId: {
          documentId,
          userId,
        },
      },
    });

    if (!documentPermission) {
      return response.errorResponse(res, "Document permission not found.");
    }

    await prisma.documentPermission.delete({
      where: {
        id: documentPermission.id,
      },
    });

    return response.successResponse(
      res,
      "Document permission removed successfully."
    );
  } catch (error) {
    console.error(error);
    response.errorResponse(res, "Internal server error.");
  }
};
