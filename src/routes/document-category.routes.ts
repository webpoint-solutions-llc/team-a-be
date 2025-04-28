import { Router } from "express";
import * as documentCategoryController from "../controllers/document-category.controller";
import { auth } from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/document-categories",
  auth,
  documentCategoryController.createDocumentCategory
);
router.get(
  "/document-categories/project/:projectId",
  auth,
  documentCategoryController.getDocumentCategoriesByProject
);
router.get(
  "/document-categories/:id",
  auth,
  documentCategoryController.getDocumentCategoryById
);
router.put(
  "/document-categories/:id",
  auth,
  documentCategoryController.updateDocumentCategory
);
router.delete(
  "/document-categories/:id",
  auth,
  documentCategoryController.deleteDocumentCategory
);

export default router;
