import express from "express";
import {
  addProjectMember,
  getProjectMembers,
  removeProjectMember,
} from "../controllers/project-member.controller";

const router = express.Router();

router.post("/project-members", addProjectMember);
router.get("/project-members/:projectId", getProjectMembers);
router.delete("/project-members/:projectId/:userId", removeProjectMember);

export default router;
