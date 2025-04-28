import express from "express";
import {
  addProjectMember,
  getProjectMembers,
  removeProjectMember,
} from "../controllers/project-member.controller";
import { auth } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/", auth, addProjectMember);
router.get("/:projectId", auth, getProjectMembers);
router.delete("/:projectId/:userId", auth, removeProjectMember);

export default router;
