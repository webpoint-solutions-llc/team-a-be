import express from "express";
import {
  createDocument,
  getDocumentsByCategory,
  getDocumentById,
  updateDocument,
  deleteDocument,
  getAllDocumentsOfProject,
} from "../controllers/document.controller";
import { auth } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/", auth, createDocument);
router.get("/category/:categoryId", auth, getDocumentsByCategory);
router.get("/:projectId", auth, getAllDocumentsOfProject);
router.get("/:id", auth, getDocumentById);
router.put("/:id", auth, updateDocument);
router.delete("/:id", auth, deleteDocument);

export default router;
