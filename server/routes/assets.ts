import express, { Request, Response } from 'express';
import { Asset } from '../models';

const router = express.Router();

// Get all assets for the authenticated user
router.get('/', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userId = (req.user as any)._id;
    const userAssets = await Asset.find({ userId }).sort({ createdAt: -1 });
    
    res.status(200).json(userAssets);
  } catch (error) {
    console.error("Error fetching assets:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get asset by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const assetId = req.params.id;
    const userId = (req.user as any)._id;
    
    const asset = await Asset.findOne({ _id: assetId, userId });
    
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    
    res.status(200).json(asset);
  } catch (error) {
    console.error("Error fetching asset:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new asset
router.post('/', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userId = (req.user as any)._id;
    
    const newAsset = new Asset({
      ...req.body,
      userId
    });
    
    const savedAsset = await newAsset.save();
    
    res.status(201).json(savedAsset);
  } catch (error) {
    console.error("Error creating asset:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update an asset
router.put('/:id', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const assetId = req.params.id;
    const userId = (req.user as any)._id;
    
    const updatedAsset = await Asset.findOneAndUpdate(
      { _id: assetId, userId },
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    
    if (!updatedAsset) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    
    res.status(200).json(updatedAsset);
  } catch (error) {
    console.error("Error updating asset:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete an asset
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const assetId = req.params.id;
    const userId = (req.user as any)._id;
    
    const deletedAsset = await Asset.findOneAndDelete({ _id: assetId, userId });
    
    if (!deletedAsset) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    
    res.status(200).json({ message: 'Asset deleted successfully' });
  } catch (error) {
    console.error("Error deleting asset:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;