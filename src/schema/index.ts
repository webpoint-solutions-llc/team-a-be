import { z } from "zod";

const isValidUUID = (value: string) => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
};

export const StatusEnum = z.enum(["active", "completed", "archived"]);

export const createUserSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const updateUserSchema = z.object({
  fullName: z.string().min(1, "Full name is required").optional(),
  email: z.string().email("Invalid email address").optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional(),
});

export const createProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  kickoffDate: z.string(),
  deadline: z.string(),
  status: StatusEnum.optional().default("active"),
});

export const updateProjectSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().optional(),
  kickoffDate: z.string().datetime().or(z.date()).optional(),
  deadline: z.string().datetime().or(z.date()).optional(),
  status: StatusEnum.optional(),
});

export const createProjectRoleSchema = z.object({
  name: z.string().min(1, "Role name is required"),
  projectId: z
    .string()
    .refine(isValidUUID, { message: "Invalid project UUID" }),
});

export const updateProjectRoleSchema = z.object({
  name: z.string().min(1, "Role name is required").optional(),
  projectId: z
    .string()
    .refine(isValidUUID, { message: "Invalid project UUID" })
    .optional(),
});

export const createProjectMemberSchema = z.object({
  userId: z.string().refine(isValidUUID, { message: "Invalid user UUID" }),
  projectId: z
    .string()
    .refine(isValidUUID, { message: "Invalid project UUID" }),
  roleId: z.string().refine(isValidUUID, { message: "Invalid role UUID" }),
});

export const updateProjectMemberSchema = z.object({
  userId: z
    .string()
    .refine(isValidUUID, { message: "Invalid user UUID" })
    .optional(),
  projectId: z
    .string()
    .refine(isValidUUID, { message: "Invalid project UUID" })
    .optional(),
  roleId: z
    .string()
    .refine(isValidUUID, { message: "Invalid role UUID" })
    .optional(),
});

export const createDocumentCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
  projectId: z
    .string()
    .refine(isValidUUID, { message: "Invalid project UUID" }),
});

export const updateDocumentCategorySchema = z.object({
  name: z.string().min(1, "Category name is required").optional(),
  description: z.string().optional(),
  projectId: z
    .string()
    .refine(isValidUUID, { message: "Invalid project UUID" })
    .optional(),
});

export const createDocumentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  link: z.string().url("Invalid URL"),
  tags: z.string().optional(),
  visibility: z.enum(["public", "private"]).default("public").optional(),
  createdById: z.string().refine(isValidUUID, { message: "Invalid user UUID" }),
  categoryId: z
    .string()
    .refine(isValidUUID, { message: "Invalid category UUID" }),
});

export const updateDocumentSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().optional(),
  link: z.string().url("Invalid URL").optional(),
  tags: z.string().optional(),
  visibility: z.enum(["public", "private"]).optional(),
  categoryId: z
    .string()
    .refine(isValidUUID, { message: "Invalid category UUID" })
    .optional(),
});

export const createDocumentPermissionSchema = z.object({
  documentId: z
    .string()
    .refine(isValidUUID, { message: "Invalid document UUID" }),
  userId: z.string().refine(isValidUUID, { message: "Invalid user UUID" }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type CreateProjectRoleInput = z.infer<typeof createProjectRoleSchema>;
export type UpdateProjectRoleInput = z.infer<typeof updateProjectRoleSchema>;
export type CreateProjectMemberInput = z.infer<
  typeof createProjectMemberSchema
>;
export type UpdateProjectMemberInput = z.infer<
  typeof updateProjectMemberSchema
>;
export type CreateDocumentCategoryInput = z.infer<
  typeof createDocumentCategorySchema
>;
export type UpdateDocumentCategoryInput = z.infer<
  typeof updateDocumentCategorySchema
>;
export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
export type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>;
export type CreateDocumentPermissionInput = z.infer<
  typeof createDocumentPermissionSchema
>;

export const schemas = {
  createUser: createUserSchema,
  updateUser: updateUserSchema,
  createProject: createProjectSchema,
  updateProject: updateProjectSchema,
  createProjectRole: createProjectRoleSchema,
  updateProjectRole: updateProjectRoleSchema,
  createProjectMember: createProjectMemberSchema,
  updateProjectMember: updateProjectMemberSchema,
  createDocumentCategory: createDocumentCategorySchema,
  updateDocumentCategory: updateDocumentCategorySchema,
  createDocument: createDocumentSchema,
  updateDocument: updateDocumentSchema,
  createDocumentPermission: createDocumentPermissionSchema,
};

export default schemas;
