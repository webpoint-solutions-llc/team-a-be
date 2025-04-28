import { Request, Response, NextFunction } from "express";
import prisma from "../db/prisma";
import * as response from "../utils/response";
import { ZodError } from "zod";
import { createDocumentSchema, updateDocumentSchema } from "../schema";

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
    } = createDocumentSchema.parse(req.body);

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
    if (error instanceof ZodError) {
      return response.zodErrorResponse(res, error);
    }
    return response.errorResponse(res, "Internal server error.");
  }
};

export const getAllDocumentsOfProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { projectId } = req.params;
    const query = req.query.query as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const search = query ? query.trim().toLowerCase() : undefined;

    const whereClause: any = { projectId };

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { tags: { contains: search, mode: "insensitive" } },
        { link: { contains: search, mode: "insensitive" } },
      ];
    }

    const totalCount = await prisma.document.count({ where: whereClause });

    const documents = await prisma.document.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    if (documents.length === 0 && page === 1) {
      return response.errorResponse(
        res,
        "No documents found for this project."
      );
    }

    return response.successResponse(res, "Documents fetched successfully.", {
      data: documents,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
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
    const query = req.query.query as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const search = query ? query.trim().toLowerCase() : undefined;

    const whereClause: any = { categoryId };

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { tags: { contains: search, mode: "insensitive" } },
        { link: { contains: search, mode: "insensitive" } },
      ];
    }

    const totalCount = await prisma.document.count({ where: whereClause });

    const documents = await prisma.document.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    if (documents.length === 0 && page === 1) {
      return response.errorResponse(
        res,
        "No documents found in this category."
      );
    }

    return response.successResponse(res, "Documents fetched successfully.", {
      data: documents,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching documents by category:", error);
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
    const { title, description, link, tags, visibility, categoryId } =
      updateDocumentSchema.parse(req.body);

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
    if (error instanceof ZodError) {
      return response.zodErrorResponse(res, error);
    }
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
