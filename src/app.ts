import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import path from "path";
import { frontendUrl } from "./config";

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



export default app;