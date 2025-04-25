import express, { Request, Response } from 'express';
import { Expense } from '../models';

const router = express.Router();

// Get all expenses for the authenticated user
router.get('/', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userId = (req.user as any)._id;
    const userExpenses = await Expense.find({ userId }).sort({ createdAt: -1 });
    
    res.status(200).json(userExpenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get expense by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const expenseId = req.params.id;
    const userId = (req.user as any)._id;
    
    const expense = await Expense.findOne({ _id: expenseId, userId });
    
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    res.status(200).json(expense);
  } catch (error) {
    console.error("Error fetching expense:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new expense
router.post('/', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userId = (req.user as any)._id;
    
    const newExpense = new Expense({
      ...req.body,
      userId
    });
    
    const savedExpense = await newExpense.save();
    
    res.status(201).json(savedExpense);
  } catch (error) {
    console.error("Error creating expense:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update an expense
router.put('/:id', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const expenseId = req.params.id;
    const userId = (req.user as any)._id;
    
    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: expenseId, userId },
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    
    if (!updatedExpense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    res.status(200).json(updatedExpense);
  } catch (error) {
    console.error("Error updating expense:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete an expense
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const expenseId = req.params.id;
    const userId = (req.user as any)._id;
    
    const deletedExpense = await Expense.findOneAndDelete({ _id: expenseId, userId });
    
    if (!deletedExpense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;