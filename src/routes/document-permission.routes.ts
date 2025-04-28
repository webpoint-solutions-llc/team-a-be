import express from "express";
import {
  addDocumentPermission,
  getDocumentPermissions,
  removeDocumentPermission,
} from "../controllers/document-permission.controller";
import { auth } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/", auth, addDocumentPermission);
router.get("/:documentId", auth, getDocumentPermissions);
router.delete("/:documentId/:userId", auth, removeDocumentPermission);

export default router;
