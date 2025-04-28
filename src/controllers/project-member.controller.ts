import { Request, Response, NextFunction } from "express";
import prisma from "../db/prisma";
import * as response from "../utils/response";

export const addProjectMember = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId, projectId, roleId } = req.body;

    const existingMember = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId,
          projectId,
        },
      },
    });

    if (existingMember) {
      return response.errorResponse(
        res,
        "User is already a member of this project."
      );
    }

    const projectMember = await prisma.projectMember.create({
      data: {
        userId,
        projectId,
        roleId,
      },
    });

    return response.successResponse(res, "Project member added successfully.", {
      projectMember,
    });
  } catch (error) {
    console.error(error);
    response.errorResponse(res, "Internal server error.");
  }
};

export const getProjectMembers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { projectId } = req.params;

    const members = await prisma.projectMember.findMany({
      where: { projectId },
      include: {
        user: true,
        role: true,
      },
    });

    if (members.length === 0) {
      return response.errorResponse(res, "No members found for this project.");
    }

    return response.successResponse(
      res,
      "Project members fetched successfully.",
      { members }
    );
  } catch (error) {
    console.error(error);
    response.errorResponse(res, "Internal server error.");
  }
};

export const removeProjectMember = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId, projectId } = req.params;

    const projectMember = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId,
          projectId,
        },
      },
    });

    if (!projectMember) {
      return response.errorResponse(res, "Project member not found.");
    }

    await prisma.projectMember.delete({
      where: {
        id: projectMember.id,
      },
    });

    return response.successResponse(
      res,
      "Project member removed successfully."
    );
  } catch (error) {
    console.error(error);
    response.errorResponse(res, "Internal server error.");
  }
};
