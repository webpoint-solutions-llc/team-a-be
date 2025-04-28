import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import path from "path";
import { frontendUrl } from "./config";
import projectRoutes from "./routes/project.routes";
import userRoutes from "./routes/user.routes";
import documentCategoryRoutes from "./routes/document-category.routes";
import documentRoutes from "./routes/document.routes";
import projectMemberRoutes from "./routes/project-member.routes";
import documentPermissions from "./routes/document-permission.routes";

import { auth } from "./middleware/auth.middleware";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

app.use(auth);

app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/document-categories", documentCategoryRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/project-members", projectMemberRoutes);
app.use("/api/document-permissions", documentPermissions);

export default app;
