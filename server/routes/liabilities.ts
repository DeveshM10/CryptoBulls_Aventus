import express, { Request, Response } from 'express';
import { Liability } from '../models';

const router = express.Router();

// Get all liabilities for the current user
router.get('/', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const liabilities = await Liability.find({ userId: req.user._id });
    res.json(liabilities);
  } catch (error) {
    console.error('Error fetching liabilities:', error);
    res.status(500).json({ error: 'Failed to fetch liabilities' });
  }
});

// Get a single liability by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const liability = await Liability.findOne({ _id: req.params.id, userId: req.user._id });
    
    if (!liability) {
      return res.status(404).json({ error: 'Liability not found' });
    }
    
    res.json(liability);
  } catch (error) {
    console.error('Error fetching liability:', error);
    res.status(500).json({ error: 'Failed to fetch liability' });
  }
});

// Create a new liability
router.post('/', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const newLiability = new Liability({
      ...req.body,
      userId: req.user._id,
    });
    
    const savedLiability = await newLiability.save();
    res.status(201).json(savedLiability);
  } catch (error) {
    console.error('Error creating liability:', error);
    res.status(500).json({ error: 'Failed to create liability' });
  }
});

// Update a liability
router.put('/:id', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const liability = await Liability.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { ...req.body, userId: req.user._id },
      { new: true, runValidators: true }
    );
    
    if (!liability) {
      return res.status(404).json({ error: 'Liability not found' });
    }
    
    res.json(liability);
  } catch (error) {
    console.error('Error updating liability:', error);
    res.status(500).json({ error: 'Failed to update liability' });
  }
});

// Delete a liability
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const liability = await Liability.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    
    if (!liability) {
      return res.status(404).json({ error: 'Liability not found' });
    }
    
    res.status(200).json({ message: 'Liability deleted successfully' });
  } catch (error) {
    console.error('Error deleting liability:', error);
    res.status(500).json({ error: 'Failed to delete liability' });
  }
});

export default router;