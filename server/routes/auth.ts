import { Request, Response, Router } from 'express';
import { User, IUser } from '../models';
import mongoose from 'mongoose';

const router = Router();

// Register a new user
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // In a real app, we would hash the password before saving
    const newUser = new User({
      username,
      email,
      password, // In production, use bcrypt to hash this password
    });
    
    const savedUser = await newUser.save();
    
    // Remove password from response
    const userResponse = {
      _id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      kycVerified: savedUser.kycVerified,
      walletAddress: savedUser.walletAddress
    };
    
    res.status(201).json(userResponse);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login user
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Find user by username or email
    const user = await User.findOne({ 
      $or: [{ email: username }, { username }] 
    });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // In a real app, we would compare hashed passwords
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Remove password from response
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      kycVerified: user.kycVerified,
      walletAddress: user.walletAddress
    };
    
    res.status(200).json(userResponse);
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user KYC information
router.put('/kyc/:userId', async (req: Request, res: Response) => {
  try {
    const { fullName, dob, address, panId, panImage, walletAddress } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { 
        fullName, 
        dob, 
        address, 
        panId, 
        panImage, 
        walletAddress,
        kycVerified: true 
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Remove password from response
    const userResponse = {
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      fullName: updatedUser.fullName,
      dob: updatedUser.dob,
      address: updatedUser.address,
      panId: updatedUser.panId,
      panImage: updatedUser.panImage,
      walletAddress: updatedUser.walletAddress,
      kycVerified: updatedUser.kycVerified
    };
    
    res.status(200).json(userResponse);
  } catch (error) {
    console.error('Error updating KYC info:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user by ID (removes sensitive info)
router.get('/:id', async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Remove password from response
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      dob: user.dob,
      address: user.address,
      panId: user.panId,
      panImage: user.panImage,
      walletAddress: user.walletAddress,
      kycVerified: user.kycVerified
    };
    
    res.status(200).json(userResponse);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;