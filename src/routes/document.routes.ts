import express from "express";
import {
  createDocument,
  getDocumentsByCategory,
  getDocumentById,
  updateDocument,
  deleteDocument,
} from "../controllers/document.controller";
import { auth } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/documents", auth, createDocument);
router.get("/documents/category/:categoryId", auth, getDocumentsByCategory);
router.get("/documents/:id", auth, getDocumentById);
router.put("/documents/:id", auth, updateDocument);
router.delete("/documents/:id", auth, deleteDocument);

export default router;
