import express from "express";
import {
  addDocumentPermission,
  getDocumentPermissions,
  removeDocumentPermission,
} from "../controllers/document-permission.controller";

const router = express.Router();

router.post("/document-permissions", addDocumentPermission);
router.get("/document-permissions/:documentId", getDocumentPermissions);
router.delete(
  "/document-permissions/:documentId/:userId",
  removeDocumentPermission
);

export default router;
