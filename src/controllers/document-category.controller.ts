import { Request, Response, NextFunction } from "express";
import * as response from "../utils/response";
import prisma from "../db/prisma";
import {
  updateDocumentCategorySchema,
  createDocumentCategorySchema,
} from "../schema";
import { ZodError } from "zod";

export const createDocumentCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { projectId, name, description } = createDocumentCategorySchema.parse(
      req.body
    );

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return response.errorResponse(res, "Project not found.");
    }

    const existingCategory = await prisma.documentCategory.findUnique({
      where: { projectId_name: { projectId, name } },
    });

    if (existingCategory) {
      return response.errorResponse(
        res,
        "Document category with this name already exists for this project."
      );
    }

    const documentCategory = await prisma.documentCategory.create({
      data: {
        projectId,
        name,
        description,
      },
    });

    return response.successResponse(res, "Category created successfully.", {
      data: documentCategory,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return response.zodErrorResponse(res, error);
    }
    return response.errorResponse(res, "Internal server error.");
  }
};

export const getDocumentCategoriesByProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { projectId } = req.params;

    const documentCategories = await prisma.documentCategory.findMany({
      where: { projectId },
    });

    if (documentCategories.length === 0) {
      return response.errorResponse(
        res,
        "No document categories found for this project."
      );
    }

    return response.successResponse(
      res,
      "Document categories fetched successfully.",
      {
        data: documentCategories,
      }
    );
  } catch (error) {
    console.error(error);
    return response.errorResponse(res, "Internal server error.");
  }
};

export const getDocumentCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const documentCategory = await prisma.documentCategory.findUnique({
      where: { id },
    });

    if (!documentCategory) {
      return response.errorResponse(res, "Document category not found.");
    }

    return response.successResponse(
      res,
      "Document category fetched successfully.",
      {
        data: documentCategory,
      }
    );
  } catch (error) {
    return response.errorResponse(res, "Internal server error.");
  }
};

export const updateDocumentCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description } = updateDocumentCategorySchema.parse(req.body);

    const existingCategory = await prisma.documentCategory.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return response.errorResponse(res, "Document category not found.");
    }

    const updatedCategory = await prisma.documentCategory.update({
      where: { id },
      data: { name, description },
    });

    return response.successResponse(
      res,
      "Document category updated successfully.",
      {
        data: updatedCategory,
      }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return response.zodErrorResponse(res, error);
    }
    return response.errorResponse(res, "Internal server error.");
  }
};

export const deleteDocumentCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const existingCategory = await prisma.documentCategory.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return response.errorResponse(res, "Document category not found.");
    }

    await prisma.documentCategory.delete({
      where: { id },
    });

    return response.successResponse(
      res,
      "Document category deleted successfully."
    );
  } catch (error) {
    return response.errorResponse(res, "Internal server error.");
  }
};
