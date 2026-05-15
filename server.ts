import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import mediaRouter from "./src/backend/modules/media/media.routes.ts";
import authRouter from "./src/backend/modules/auth/auth.routes.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // --- BODY PARSING ---
  app.use(express.json());

  // --- API ROUTES ---

  // Auth Module
  app.use("/api/auth", authRouter);

  // Media Module
  app.use("/api/media", mediaRouter);

  // Recognition API
  app.get("/api/recognition", (req, res) => {
    res.json([
      { id: 1, from: "Sarah", to: "Mike", message: "Great job!", status: "APPROVED" }
    ]);
  });

  // Ask CEO API
  app.get("/api/ceo-questions", (req, res) => {
    res.json([
      { id: 1, question: "What's the roadmap?", status: "ANSWERED", answer: "Growth." }
    ]);
  });

  // --- VITE MIDDLEWARE (dev) / STATIC BUILD (prod) ---

  if (process.env.NODE_ENV !== "production") {
    console.log(">>> Starting development server with Vite middleware...");
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    // Vite must come BEFORE express.static so it can serve
    // /@vite/client, /src/*, /@react-refresh, etc.
    app.use(vite.middlewares);
  }

  // --- STATIC FILES ---
  // In dev, this only serves actual files from /public (images, fonts, etc.)
  // Vite has already handled its own virtual paths above.
  const publicPath =
    process.env.NODE_ENV === "production"
      ? path.join(__dirname, "..", "public")
      : path.join(process.cwd(), "public");

  app.use(express.static(publicPath));
  app.use("/uploads", express.static(path.join(publicPath, "uploads")));

  // --- PRODUCTION FALLBACK ---
  // Serve index.html for all unmatched routes (SPA client-side routing)
  if (process.env.NODE_ENV === "production") {
    const distPath = __dirname;
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // --- GLOBAL ERROR HANDLER ---
  // Must be last — Express identifies error handlers by their 4-argument signature
  app.use((err: any, req: any, res: any, next: any) => {
    console.error(">>> SERVER ERROR:", err.stack || err);
    if (req.path.startsWith("/api/")) {
      return res.status(err.status || 500).json({
        error: err.message || "Internal Server Error",
      });
    }
    next(err);
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`>>> THE BAOBAB TIMES server running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error(">>> FATAL SERVER STARTUP ERROR:", error);
  process.exit(1);
});