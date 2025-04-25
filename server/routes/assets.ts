import { Request, Response, Router } from 'express';
import { Asset } from '../models';
import { IAsset } from '../models/Asset';
import mongoose from 'mongoose';

const router = Router();

// Get all assets
router.get('/', async (req: Request, res: Response) => {
  try {
    // In a real app, this would filter by the authenticated user's ID
    // For now, we'll just return all assets or can use a query parameter
    const userId = req.query.userId || null;
    
    let query = {};
    if (userId && mongoose.Types.ObjectId.isValid(userId as string)) {
      query = { userId: userId };
    }
    
    const assets = await Asset.find(query).sort({ createdAt: -1 });
    res.status(200).json(assets);
  } catch (error) {
    console.error('Error fetching assets:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single asset by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const asset = await Asset.findById(req.params.id);
    
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }
    
    res.status(200).json(asset);
  } catch (error) {
    console.error('Error fetching asset:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new asset
router.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, title, value, type, date, change, trend } = req.body;
    
    if (!userId || !title || !value || !type || !date || !change || !trend) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    const newAsset = new Asset({
      userId,
      title,
      value,
      type,
      date,
      change,
      trend
    });
    
    const savedAsset = await newAsset.save();
    res.status(201).json(savedAsset);
  } catch (error) {
    console.error('Error creating asset:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update an asset
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { title, value, type, date, change, trend } = req.body;
    
    const updatedAsset = await Asset.findByIdAndUpdate(
      req.params.id,
      { title, value, type, date, change, trend },
      { new: true, runValidators: true }
    );
    
    if (!updatedAsset) {
      return res.status(404).json({ message: 'Asset not found' });
    }
    
    res.status(200).json(updatedAsset);
  } catch (error) {
    console.error('Error updating asset:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete an asset
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deletedAsset = await Asset.findByIdAndDelete(req.params.id);
    
    if (!deletedAsset) {
      return res.status(404).json({ message: 'Asset not found' });
    }
    
    res.status(200).json({ message: 'Asset deleted successfully' });
  } catch (error) {
    console.error('Error deleting asset:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;