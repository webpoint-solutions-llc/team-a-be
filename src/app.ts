import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import path from "path";
import { frontendUrl } from "./config";
import projectRoutes from "./routes/project.routes";
import userRoutes from "./routes/user.routes";
import documentCategoryRoutes from "./routes/document-category.routes";
import documentRoutes from "./routes/document.routes";
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

app.use(auth);

app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/document-categories", documentCategoryRoutes);
app.use("/api/documents", documentRoutes);

export default app;
