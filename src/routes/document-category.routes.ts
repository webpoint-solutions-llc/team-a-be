import { Router } from "express";
import * as documentCategoryController from "../controllers/document-category.controller";
import { auth } from "../middleware/auth.middleware";

const router = Router();

router.post("", auth, documentCategoryController.createDocumentCategory);
router.get(
  "/project/:projectId",
  auth,
  documentCategoryController.getDocumentCategoriesByProject
);
router.get("/:id", auth, documentCategoryController.getDocumentCategoryById);
router.put("/:id", auth, documentCategoryController.updateDocumentCategory);
router.delete("/:id", auth, documentCategoryController.deleteDocumentCategory);

export default router;
