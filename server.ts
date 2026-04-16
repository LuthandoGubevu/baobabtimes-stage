import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import articlesRouter from "./src/backend/modules/articles/articles.routes";
import mediaRouter from "./src/backend/modules/media/media.routes.ts";
import { notificationService } from "./src/backend/services/notificationService";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API ROUTES ---
  
  // Notifications API
  app.post("/api/notifications/broadcast", async (req, res) => {
    const { title, body, url } = req.body;
    try {
      await notificationService.broadcast(title, body, url);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/notifications/send", async (req, res) => {
    const { userId, title, body, url } = req.body;
    try {
      await notificationService.sendToUser(userId, title, body, url);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Auth Mock (to be moved to modules/auth/auth.routes.ts)
  app.post("/api/auth/login", (req, res) => {
    const { email } = req.body;
    const role = email.includes("admin") ? "ADMIN" : 
                 email.includes("ceo") ? "CEO" : 
                 email.includes("contributor") ? "CONTRIBUTOR" : "VIEWER";
    
    res.json({
      token: "mock-jwt-token",
      user: { id: "1", name: "John Doe", email, role }
    });
  });

  // Articles Module
  app.use("/api/articles", articlesRouter);

  // Media Module
  app.use("/api/media", mediaRouter);

  // Serve Firebase Config for Service Worker
  app.get("/firebase-applet-config.json", (req, res) => {
    res.sendFile(path.join(process.cwd(), "firebase-applet-config.json"));
  });

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
