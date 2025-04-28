import { Router } from "express";
import * as documentCategoryController from "../controllers/document-category.controller";

const router = Router();

router.post(
  "/document-categories",
  documentCategoryController.createDocumentCategory
);
router.get(
  "/document-categories/project/:projectId",
  documentCategoryController.getDocumentCategoriesByProject
);
router.get(
  "/document-categories/:id",
  documentCategoryController.getDocumentCategoryById
);
router.put(
  "/document-categories/:id",
  documentCategoryController.updateDocumentCategory
);
router.delete(
  "/document-categories/:id",
  documentCategoryController.deleteDocumentCategory
);

export default router;
