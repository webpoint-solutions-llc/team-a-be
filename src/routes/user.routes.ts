import express from "express";
import * as uc from "../controllers/user.controller";
import { auth } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/login", uc.login);
router.post("/register", uc.register);
router.post("/me", uc.getMe);
router.post("/logout", auth, uc.logout);

export default router;
