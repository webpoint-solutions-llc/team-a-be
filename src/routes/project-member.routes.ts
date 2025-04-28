import express from "express";
import {
  addProjectMember,
  getProjectMembers,
  removeProjectMember,
} from "../controllers/project-member.controller";
import { auth } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/project-members", auth, addProjectMember);
router.get("/project-members/:projectId", auth, getProjectMembers);
router.delete("/project-members/:projectId/:userId", auth, removeProjectMember);

export default router;
