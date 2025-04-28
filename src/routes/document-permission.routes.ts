import express from "express";
import {
  addDocumentPermission,
  getDocumentPermissions,
  removeDocumentPermission,
} from "../controllers/document-permission.controller";
import { auth } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/document-permissions", auth, addDocumentPermission);
router.get("/document-permissions/:documentId", auth, getDocumentPermissions);
router.delete(
  "/document-permissions/:documentId/:userId",
  auth,
  removeDocumentPermission
);

export default router;
