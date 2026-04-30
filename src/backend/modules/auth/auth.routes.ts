import express from "express";
import { syncUserRole, authenticate } from "./auth.service.ts";

const router = express.Router();

/**
 * POST /api/auth/sync
 * Syncs the current user's role based on their email.
 * This should be called after a successful login or signup.
 */
router.post("/sync", authenticate, async (req: any, res) => {
  try {
    const { uid, email } = req.user;
    
    if (!email) {
      return res.status(400).json({ error: "Email is required for role sync" });
    }

    const syncedUser = await syncUserRole(uid, email);
    res.json(syncedUser);
  } catch (error: any) {
    console.error("Error syncing user role:", error);
    res.status(500).json({ error: error.message || "Failed to sync user role" });
  }
});

export default router;
