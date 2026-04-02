import express from "express";
import multer from "multer";
import path from "path";
import admin from "firebase-admin";
import { verifyToken, AuthRequest } from "../../middleware/auth";

const router = express.Router();

// Configure multer for memory storage (we'll upload to Firebase Storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG and WEBP are allowed.") as any, false);
    }
  },
});

// POST /api/media/upload
router.post("/upload", verifyToken, upload.single("image"), async (req: AuthRequest, res: any) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const bucket = admin.storage().bucket();
    console.log("Attempting to upload to bucket:", bucket.name);
    
    const fileExtension = path.extname(req.file.originalname);
    const fileName = `articles/${req.user.uid}/${Date.now()}_${Math.round(Math.random() * 1e9)}${fileExtension}`;
    const file = bucket.file(fileName);

    // Upload to Firebase Storage
    try {
      await file.save(req.file.buffer, {
        metadata: {
          contentType: req.file.mimetype,
        },
        public: true,
      });
    } catch (saveError: any) {
      console.error("Firebase Storage Save Error:", saveError);
      // Check for specific error codes
      if (saveError.code === 404) {
        throw new Error(`Bucket "${bucket.name}" not found. Please ensure Firebase Storage is enabled in the console.`);
      }
      throw saveError;
    }

    // Construct the public URL
    // For Firebase Storage, the public URL format is:
    // https://storage.googleapis.com/<bucket>/<path>
    const fileUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    res.json({ url: fileUrl });
  } catch (error: any) {
    console.error("Backend upload error:", error);
    res.status(500).json({ error: error.message || "Failed to upload image to storage" });
  }
});

export default router;
