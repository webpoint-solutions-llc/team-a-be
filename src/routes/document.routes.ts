import express from "express";
import {
  createDocument,
  getDocumentsByCategory,
  getDocumentById,
  updateDocument,
  deleteDocument,
} from "../controllers/document.controller";

const router = express.Router();

router.post("/documents", createDocument);
router.get("/documents/category/:categoryId", getDocumentsByCategory);
router.get("/documents/:id", getDocumentById);
router.put("/documents/:id", updateDocument);
router.delete("/documents/:id", deleteDocument);

export default router;
