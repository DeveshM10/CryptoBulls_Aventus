import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { 
  users, kycData, assets, liabilities, 
  insertUserSchema, insertKycDataSchema, insertAssetSchema, insertLiabilitySchema 
} from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";
import { eq, desc } from "drizzle-orm";
import { ZodError } from "zod";
import bcrypt from "bcryptjs";
import connectDB from "./database";

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
  // Connect to database
  try {
    await connectDB();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection error:', error);
  }

  // Authentication routes
  app.post("/api/register", async (req, res) => {
    try {
      // Validate request data
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await db.query.users.findFirst({
        where: (users) => 
          eq(users.username, userData.username) || eq(users.email, req.body.email)
      });
      
      if (existingUser) {
        return res.status(400).json({ message: "Username or email already exists" });
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      // Create new user
      const [newUser] = await db.insert(users)
        .values({
          ...userData,
          password: hashedPassword
        })
        .returning({
          id: users.id,
          username: users.username,
          email: users.email,
          walletAddress: users.walletAddress,
          kycVerified: users.kycVerified
        });
      
      res.status(201).json(newUser);
    } catch (error) {
      console.error("Error registering user:", error);
      
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }
      
      // Find user by username or email
      const user = await db.query.users.findFirst({
        where: (users) => 
          eq(users.username, username) || eq(users.email, username)
      });
      
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Return user without password
      const { password: _, ...userResponse } = user;
      res.status(200).json(userResponse);
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/user/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      const user = await db.query.users.findFirst({
        where: eq(users.id, userId)
      });
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Return user without password
      const { password: _, ...userResponse } = user;
      res.status(200).json(userResponse);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Asset routes
  app.get("/api/assets", async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : null;
      
      let userAssets;
      if (userId) {
        userAssets = await db.query.assets.findMany({
          where: eq(assets.userId, userId),
          orderBy: desc(assets.createdAt)
        });
      } else {
        userAssets = await db.query.assets.findMany({
          orderBy: desc(assets.createdAt)
        });
      }
      
      res.status(200).json(userAssets);
    } catch (error) {
      console.error("Error fetching assets:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/assets", async (req, res) => {
    try {
      const assetData = insertAssetSchema.parse(req.body);
      
      const [newAsset] = await db.insert(assets)
        .values(assetData)
        .returning();
      
      res.status(201).json(newAsset);
    } catch (error) {
      console.error("Error creating asset:", error);
      
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/assets/:id", async (req, res) => {
    try {
      const assetId = parseInt(req.params.id);
      
      const asset = await db.query.assets.findFirst({
        where: eq(assets.id, assetId)
      });
      
      if (!asset) {
        return res.status(404).json({ message: "Asset not found" });
      }
      
      res.status(200).json(asset);
    } catch (error) {
      console.error("Error fetching asset:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.put("/api/assets/:id", async (req, res) => {
    try {
      const assetId = parseInt(req.params.id);
      
      const [updatedAsset] = await db.update(assets)
        .set({
          ...req.body,
          updatedAt: new Date()
        })
        .where(eq(assets.id, assetId))
        .returning();
        
      if (!updatedAsset) {
        return res.status(404).json({ message: "Asset not found" });
      }
      
      res.status(200).json(updatedAsset);
    } catch (error) {
      console.error("Error updating asset:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.delete("/api/assets/:id", async (req, res) => {
    try {
      const assetId = parseInt(req.params.id);
      
      const [deletedAsset] = await db.delete(assets)
        .where(eq(assets.id, assetId))
        .returning();
        
      if (!deletedAsset) {
        return res.status(404).json({ message: "Asset not found" });
      }
      
      res.status(200).json({ message: "Asset deleted successfully" });
    } catch (error) {
      console.error("Error deleting asset:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Liability routes
  app.get("/api/liabilities", async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : null;
      
      let userLiabilities;
      if (userId) {
        userLiabilities = await db.query.liabilities.findMany({
          where: eq(liabilities.userId, userId),
          orderBy: desc(liabilities.createdAt)
        });
      } else {
        userLiabilities = await db.query.liabilities.findMany({
          orderBy: desc(liabilities.createdAt)
        });
      }
      
      res.status(200).json(userLiabilities);
    } catch (error) {
      console.error("Error fetching liabilities:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/liabilities", async (req, res) => {
    try {
      const liabilityData = insertLiabilitySchema.parse(req.body);
      
      const [newLiability] = await db.insert(liabilities)
        .values(liabilityData)
        .returning();
      
      res.status(201).json(newLiability);
    } catch (error) {
      console.error("Error creating liability:", error);
      
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/liabilities/:id", async (req, res) => {
    try {
      const liabilityId = parseInt(req.params.id);
      
      const liability = await db.query.liabilities.findFirst({
        where: eq(liabilities.id, liabilityId)
      });
      
      if (!liability) {
        return res.status(404).json({ message: "Liability not found" });
      }
      
      res.status(200).json(liability);
    } catch (error) {
      console.error("Error fetching liability:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.put("/api/liabilities/:id", async (req, res) => {
    try {
      const liabilityId = parseInt(req.params.id);
      
      const [updatedLiability] = await db.update(liabilities)
        .set({
          ...req.body,
          updatedAt: new Date()
        })
        .where(eq(liabilities.id, liabilityId))
        .returning();
        
      if (!updatedLiability) {
        return res.status(404).json({ message: "Liability not found" });
      }
      
      res.status(200).json(updatedLiability);
    } catch (error) {
      console.error("Error updating liability:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.delete("/api/liabilities/:id", async (req, res) => {
    try {
      const liabilityId = parseInt(req.params.id);
      
      const [deletedLiability] = await db.delete(liabilities)
        .where(eq(liabilities.id, liabilityId))
        .returning();
        
      if (!deletedLiability) {
        return res.status(404).json({ message: "Liability not found" });
      }
      
      res.status(200).json({ message: "Liability deleted successfully" });
    } catch (error) {
      console.error("Error deleting liability:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

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
          
        // Update user's KYC verification status
        await db.update(users)
          .set({ kycVerified: true })
          .where(eq(users.id, validatedData.userId));
      } else {
        // Insert new KYC data
        [result] = await db.insert(kycData).values(validatedData).returning();
        
        // Update user's KYC verification status
        await db.update(users)
          .set({ kycVerified: true })
          .where(eq(users.id, validatedData.userId));
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
