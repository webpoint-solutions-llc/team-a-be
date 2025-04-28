import { Request, Response, NextFunction } from "express";
import { PrismaClient, Status } from "@prisma/client";
import * as response from "../utils/response";
import { createProjectSchema, updateProjectSchema } from "../schema";
import { ZodError } from "zod";
import prisma from "../db/prisma";

export const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    let startDate: Date;
    let endDate: Date;

    if (!userId) {
      return response.errorResponse(res, "Unauthorized.");
    }

    const { title, description, kickoffDate, deadline, status } =
      createProjectSchema.parse(req.body);

    try {
      startDate = new Date(kickoffDate);
      endDate = new Date(deadline);
    } catch (error) {
      return response.errorResponse(res, "Invalid date format.");
    }
    if (startDate > endDate) {
      return response.errorResponse(
        res,
        "Kickoff date cannot be after deadline."
      );
    }

    const existingProject = await prisma.project.findFirst({
      where: { title },
    });
    if (existingProject) {
      return response.errorResponse(
        res,
        "Project with this name already exists."
      );
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        kickoffDate: startDate,
        deadline: endDate,
        status,
      },
    });

    const role = await prisma.projectRole.create({
      data: {
        name: "Admin",
        projectId: project.id,
      },
    });

    await prisma.projectMember.create({
      data: {
        userId,
        projectId: project.id,
        roleId: role.id,
      },
    });

    return response.successResponse(res, "Project created successfully.", {
      project,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return response.zodErrorResponse(res, error);
    }
    return response.errorResponse(res, "Internal server error.");
  }
};

export const getProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const query = req.params.query as string;
    const search = query ? query.toLowerCase() : undefined;

    if (!userId) {
      return response.errorResponse(res, "Unauthorized.");
    }
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      where: {
        projectMembers: {
          some: {
            userId,
          },
        },
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
    });

    return response.successResponse(res, "Projects fetched successfully.", {
      projects,
    });
  } catch (error) {
    console.error(error);
    return response.errorResponse(res, "Internal server error.");
  }
};

export const getArchivedProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const projects = await prisma.project.findMany({
      where: { status: "ARCHIVED" as Status },
      orderBy: { createdAt: "desc" },
    });
    return response.successResponse(
      res,
      "Archived projects fetched successfully.",
      {
        projects,
      }
    );
  } catch (error) {
    console.error(error);
    return response.errorResponse(res, "Internal server error.");
  }
};

export const getProjectById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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

export const updateProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, kickoffDate, deadline, status } =
      updateProjectSchema.parse(req.body);

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
    if (error instanceof ZodError) {
      return response.zodErrorResponse(res, error);
    }
    return response.errorResponse(res, "Internal server error.");
  }
};

export const deleteProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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
