import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import connectDB from "./database";
import { setupAuth } from "./auth";
import { User, Asset, Liability, Budget } from "./models";
import assetsRouter from "./routes/assets";
import liabilitiesRouter from "./routes/liabilities";
import budgetRouter from "./routes/budget";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
    const uploadDir = path.join(process.cwd(), "uploads");
    // Create the directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `pan-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: function (req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
    const filetypes = /jpeg|jpg|png|pdf/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only .jpeg, .jpg, .png, or .pdf files are allowed"));
  },
});

// Authentication middleware
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Connect to database
  try {
    await connectDB();
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Database connection error:', error);
  }

  // Setup authentication
  setupAuth(app);
  
  // Register specific route handlers
  app.use('/api/assets', assetsRouter);
  app.use('/api/liabilities', liabilitiesRouter);
  app.use('/api/budget', requireAuth, budgetRouter);
  
  // GET current user (added for the authenticated session)
  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    // Return user without password
    const userObj = (req.user as any).toObject();
    const { password, ...userWithoutPassword } = userObj;
    res.json(userWithoutPassword);
  });

  // Get user by ID
  app.get("/api/users/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.params.id;
      
      const user = await User.findById(userId).select('-password');
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // KYC submission endpoint
  app.post("/api/kyc", requireAuth, upload.single("panImage"), async (req, res) => {
    try {
      if (!req.user || !req.user._id) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      // Extract form data
      const kycData = {
        fullName: req.body.fullName,
        dob: req.body.dob,
        address: req.body.address,
        walletAddress: req.body.walletAddress,
        panId: req.body.pan?.toUpperCase(),
        panImage: req.file ? req.file.path : null,
      };

      // Update user with KYC data
      const updatedUser = await User.findByIdAndUpdate(
        req.user._id, 
        { 
          ...kycData, 
          kycVerified: true 
        }, 
        { new: true }
      ).select('-password');

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(201).json({
        message: "KYC data submitted successfully",
        data: updatedUser,
      });
    } catch (error) {
      console.error("Error submitting KYC data:", error);
      
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
      
      res.status(500).json({ error: "Failed to submit KYC data" });
    }
  });

  // Get KYC data for a user
  app.get("/api/kyc/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      
      const user = await User.findById(userId).select('fullName dob address walletAddress panId panImage kycVerified');

      if (!user) {
        return res.status(404).json({ error: "KYC data not found for this user" });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching KYC data:", error);
      res.status(500).json({ error: "Failed to fetch KYC data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
