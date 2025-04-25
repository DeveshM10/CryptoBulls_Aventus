import express, { Request, Response } from 'express';
import { Liability } from '../models';

const router = express.Router();

// Get all liabilities for the authenticated user
router.get('/', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userId = (req.user as any)._id;
    const userLiabilities = await Liability.find({ userId }).sort({ createdAt: -1 });
    
    res.status(200).json(userLiabilities);
  } catch (error) {
    console.error("Error fetching liabilities:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get liability by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const liabilityId = req.params.id;
    const userId = (req.user as any)._id;
    
    const liability = await Liability.findOne({ _id: liabilityId, userId });
    
    if (!liability) {
      return res.status(404).json({ error: 'Liability not found' });
    }
    
    res.status(200).json(liability);
  } catch (error) {
    console.error("Error fetching liability:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new liability
router.post('/', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userId = (req.user as any)._id;
    
    const newLiability = new Liability({
      ...req.body,
      userId
    });
    
    const savedLiability = await newLiability.save();
    
    res.status(201).json(savedLiability);
  } catch (error) {
    console.error("Error creating liability:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a liability
router.put('/:id', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const liabilityId = req.params.id;
    const userId = (req.user as any)._id;
    
    const updatedLiability = await Liability.findOneAndUpdate(
      { _id: liabilityId, userId },
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    
    if (!updatedLiability) {
      return res.status(404).json({ error: 'Liability not found' });
    }
    
    res.status(200).json(updatedLiability);
  } catch (error) {
    console.error("Error updating liability:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a liability
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const liabilityId = req.params.id;
    const userId = (req.user as any)._id;
    
    const deletedLiability = await Liability.findOneAndDelete({ _id: liabilityId, userId });
    
    if (!deletedLiability) {
      return res.status(404).json({ error: 'Liability not found' });
    }
    
    res.status(200).json({ message: 'Liability deleted successfully' });
  } catch (error) {
    console.error("Error deleting liability:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;