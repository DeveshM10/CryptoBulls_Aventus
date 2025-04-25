import express, { Request, Response } from 'express';
import { Budget } from '../models';
import mongoose from 'mongoose';

const router = express.Router();

// Get all budget items for a user
router.get('/', async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const userId = req.user._id;
    const budgetItems = await Budget.find({ userId }).sort({ createdAt: -1 });
    
    return res.status(200).json(budgetItems);
  } catch (error) {
    console.error('Error fetching budget items:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a specific budget item
router.get('/:id', async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const userId = req.user._id;
    const budgetItem = await Budget.findOne({ 
      _id: req.params.id, 
      userId 
    });
    
    if (!budgetItem) {
      return res.status(404).json({ message: 'Budget item not found' });
    }
    
    return res.status(200).json(budgetItem);
  } catch (error) {
    console.error('Error fetching budget item:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Create a new budget item
router.post('/', async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const userId = req.user._id;
    const { title, budgeted, spent, percentage, status } = req.body;
    
    // Create new budget item
    const newBudgetItem = new Budget({
      userId,
      title,
      budgeted,
      spent,
      percentage,
      status
    });
    
    await newBudgetItem.save();
    
    return res.status(201).json(newBudgetItem);
  } catch (error) {
    console.error('Error creating budget item:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Update a budget item
router.put('/:id', async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const userId = req.user._id;
    const budgetItemId = req.params.id;
    const { title, budgeted, spent, percentage, status } = req.body;
    
    // Find and update the budget item
    const updatedBudgetItem = await Budget.findOneAndUpdate(
      { _id: budgetItemId, userId },
      { 
        title, 
        budgeted, 
        spent, 
        percentage, 
        status,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!updatedBudgetItem) {
      return res.status(404).json({ message: 'Budget item not found' });
    }
    
    return res.status(200).json(updatedBudgetItem);
  } catch (error) {
    console.error('Error updating budget item:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a budget item
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const userId = req.user._id;
    const budgetItemId = req.params.id;
    
    // Find and delete the budget item
    const deletedBudgetItem = await Budget.findOneAndDelete({ 
      _id: budgetItemId, 
      userId 
    });
    
    if (!deletedBudgetItem) {
      return res.status(404).json({ message: 'Budget item not found' });
    }
    
    return res.status(200).json({ message: 'Budget item deleted successfully' });
  } catch (error) {
    console.error('Error deleting budget item:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;