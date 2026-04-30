import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import articlesRouter from "./src/backend/modules/articles/articles.routes.ts";
import mediaRouter from "./src/backend/modules/media/media.routes.ts";
import authRouter from "./src/backend/modules/auth/auth.routes.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API ROUTES ---
  
  // Auth Module
  app.use("/api/auth", authRouter);

  // Articles Module
  app.use("/api/articles", articlesRouter);

  // Media Module
  app.use("/api/media", mediaRouter);

  // Serve public directory statically (ensures assets in /public are available at root)
  app.use(express.static(path.join(process.cwd(), "public")));

  // Serve uploads statically
  app.use("/uploads", express.static(path.join(process.cwd(), "public", "uploads")));

  // Recognition API (to be moved to modules/recognition/recognition.routes.ts)
  app.get("/api/recognition", (req, res) => {
    res.json([
      { id: 1, from: "Sarah", to: "Mike", message: "Great job!", status: "APPROVED" }
    ]);
  });

  // Ask CEO API (to be moved to modules/ceo-ama/ceo-ama.routes.ts)
  app.get("/api/ceo-questions", (req, res) => {
    res.json([
      { id: 1, question: "What's the roadmap?", status: "ANSWERED", answer: "Growth." }
    ]);
  });

  // --- VITE MIDDLEWARE ---

  // Global Error Handler (ensure JSON for API errors)
  app.use((err: any, req: any, res: any, next: any) => {
    console.error(err.stack);
    if (req.path.startsWith("/api/")) {
      return res.status(err.status || 500).json({
        error: err.message || "Internal Server Error",
      });
    }
    next(err);
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`>>> THE BAOBAB TIMES server running on http://localhost:${PORT}`);
  });
}

startServer();
