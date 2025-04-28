import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import * as response from "../utils/response";

const prisma = new PrismaClient();

export const createProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, description, kickoffDate, deadline, status } = req.body;

    const project = await prisma.project.create({
      data: {
        title,
        description,
        kickoffDate: new Date(kickoffDate),
        deadline: new Date(deadline),
        status,
      },
    });

    return response.successResponse(res, "Project created successfully.", {
      project,
    });
  } catch (error) {
    console.error(error);
    return response.errorResponse(res, "Internal server error.");
  }
};

export const getProjects = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });

    return response.successResponse(res, "Projects fetched successfully.", {
      projects,
    });
  } catch (error) {
    console.error(error);
    return response.errorResponse(res, "Internal server error.");
  }
};

export const getProjectById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return response.errorResponse(res, "Project not found.");
    }

    return response.successResponse(res, "Project fetched successfully.", {
      project,
    });
  } catch (error) {
    console.error(error);
    return response.errorResponse(res, "Internal server error.");
  }
};

export const updateProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, kickoffDate, deadline, status } = req.body;

    const existingProject = await prisma.project.findUnique({ where: { id } });

    if (!existingProject) {
      return response.errorResponse(res, "Project not found.");
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        title,
        description,
        kickoffDate: kickoffDate ? new Date(kickoffDate) : undefined,
        deadline: deadline ? new Date(deadline) : undefined,
        status,
      },
    });

    return response.successResponse(res, "Project updated successfully.", {
      project,
    });
  } catch (error) {
    console.error(error);
    return response.errorResponse(res, "Internal server error.");
  }
};

export const deleteProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const existingProject = await prisma.project.findUnique({ where: { id } });

    if (!existingProject) {
      return response.errorResponse(res, "Project not found.");
    }

    await prisma.project.delete({ where: { id } });

    return response.successResponse(res, "Project deleted successfully.");
  } catch (error) {
    console.error(error);
    return response.errorResponse(res, "Internal server error.");
  }
};
