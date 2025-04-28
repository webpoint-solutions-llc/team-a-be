import { Request, Response, NextFunction } from "express";
import prisma from "../db/prisma";
import * as response from "../utils/response";

export const createDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      title,
      description,
      link,
      tags,
      visibility,
      createdById,
      categoryId,
    } = req.body;

    const category = await prisma.documentCategory.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return response.errorResponse(res, "Document category not found.");
    }

    const document = await prisma.document.create({
      data: {
        title,
        description,
        link,
        tags,
        visibility,
        createdById,
        categoryId,
      },
    });

    return response.successResponse(
      res,
      "Document created successfully.",
      document
    );
  } catch (error) {
    console.error(error);
    return response.errorResponse(res, "Internal server error.");
  }
};

export const getDocumentsByCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { categoryId } = req.params;

    const documents = await prisma.document.findMany({
      where: { categoryId },
      orderBy: { createdAt: "desc" },
    });

    if (documents.length === 0) {
      return response.errorResponse(
        res,
        "No documents found in this category."
      );
    }

    return response.successResponse(res, "Documents fetched successfully.", {
      data: documents,
    });
  } catch (error) {
    console.error(error);
    return response.errorResponse(res, "Internal server error.");
  }
};

export const getDocumentById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      return response.errorResponse(res, "Document not found.");
    }

    return response.successResponse(
      res,
      "Document fetched successfully.",
      document
    );
  } catch (error) {
    console.error(error);
    return response.errorResponse(res, "Internal server error.");
  }
};

export const updateDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, link, tags, visibility, categoryId } = req.body;

    const existingDocument = await prisma.document.findUnique({
      where: { id },
    });

    if (!existingDocument) {
      return response.errorResponse(res, "Document not found.");
    }

    const category = await prisma.documentCategory.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return response.errorResponse(res, "Document category not found.");
    }

    const updatedDocument = await prisma.document.update({
      where: { id },
      data: {
        title,
        description,
        link,
        tags,
        visibility,
        categoryId,
      },
    });

    return response.successResponse(
      res,
      "Document updated successfully.",
      updatedDocument
    );
  } catch (error) {
    console.error(error);
    return response.errorResponse(res, "Internal server error.");
  }
};

export const deleteDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const existingDocument = await prisma.document.findUnique({
      where: { id },
    });

    if (!existingDocument) {
      return response.errorResponse(res, "Document not found.");
    }

    await prisma.document.delete({
      where: { id },
    });

    return response.successResponse(res, "Document deleted successfully.");
  } catch (error) {
    console.error(error);
    return response.errorResponse(res, "Internal server error.");
  }
};
