import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { kycData, insertKycDataSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";
import { eq } from "drizzle-orm";
import { ZodError } from "zod";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(process.cwd(), "uploads");
    // Create the directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `pan-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|pdf/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only .jpeg, .jpg, .png, or .pdf files are allowed"));
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // KYC submission endpoint
  app.post("/api/kyc", upload.single("panImage"), async (req, res) => {
    try {
      // Extract form data
      const kycFormData = {
        userId: parseInt(req.body.userId),
        fullName: req.body.fullName,
        pan: req.body.pan.toUpperCase(),
        dob: new Date(req.body.dob),
        address: req.body.address,
        walletAddress: req.body.walletAddress,
        panCardImagePath: req.file ? req.file.path : null,
      };

      // Validate data
      const validatedData = insertKycDataSchema.parse(kycFormData);

      // Check if KYC already exists for user
      const existingKyc = await db.query.kycData.findFirst({
        where: eq(kycData.userId, validatedData.userId),
      });

      let result;
      if (existingKyc) {
        // Update existing KYC data
        [result] = await db
          .update(kycData)
          .set({
            ...validatedData,
            updatedAt: new Date(),
          })
          .where(eq(kycData.userId, validatedData.userId))
          .returning();
      } else {
        // Insert new KYC data
        [result] = await db.insert(kycData).values(validatedData).returning();
      }

      res.status(201).json({
        message: "KYC data submitted successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error submitting KYC data:", error);
      
      if (error instanceof ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
      
      res.status(500).json({ error: "Failed to submit KYC data" });
    }
  });

  // Get KYC data for a user
  app.get("/api/kyc/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      const userKyc = await db.query.kycData.findFirst({
        where: eq(kycData.userId, userId),
      });

      if (!userKyc) {
        return res.status(404).json({ error: "KYC data not found for this user" });
      }

      res.status(200).json(userKyc);
    } catch (error) {
      console.error("Error fetching KYC data:", error);
      res.status(500).json({ error: "Failed to fetch KYC data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
