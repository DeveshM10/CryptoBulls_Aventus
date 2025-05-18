import express, { Request, Response } from 'express';
import { DailyExpense } from '../models';

const router = express.Router();

// Get all daily expenses for the current user
router.get('/', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const expenses = await DailyExpense.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(100);
    
    res.json(expenses);
  } catch (error) {
    console.error('Error fetching daily expenses:', error);
    res.status(500).json({ error: 'Failed to fetch daily expenses' });
  }
});

// Get a single daily expense by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const expense = await DailyExpense.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    res.json(expense);
  } catch (error) {
    console.error('Error fetching expense:', error);
    res.status(500).json({ error: 'Failed to fetch expense' });
  }
});

// Create a new daily expense
router.post('/', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { 
      title, 
      amount, 
      category,
      date,
      notes
    } = req.body;

    // Create new expense
    const newExpense = new DailyExpense({
      userId: req.user._id,
      title,
      amount,
      category,
      date,
      notes
    });
    
    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({ error: 'Failed to create expense' });
  }
});

// Update an expense
router.put('/:id', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { 
      title, 
      amount, 
      category,
      date,
      notes
    } = req.body;
    
    const expense = await DailyExpense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { 
        title, 
        amount, 
        category,
        date,
        notes
      },
      { new: true }
    );
    
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    res.json(expense);
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ error: 'Failed to update expense' });
  }
});

// Delete an expense
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const expense = await DailyExpense.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

// Get expenses statistics
router.get('/stats/summary', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = req.user._id;
    
    // Get total expenses
    const expenses = await DailyExpense.find({ userId });
    
    // Calculate total amount
    const totalAmount = expenses.reduce((sum, expense) => {
      const amount = parseFloat(expense.amount.replace(/[₹,]/g, ""));
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
    
    // Get expense categories with counts
    const categories = await DailyExpense.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: '$category', count: { $sum: 1 }, total: { $sum: { $toDouble: { $replaceAll: { input: '$amount', find: '₹', replacement: '' } } } } } },
      { $sort: { total: -1 } }
    ]);
    
    // Get month-wise expense totals for the last 6 months
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth() - 5);
    
    const monthlyExpenses = await DailyExpense.aggregate([
      { 
        $match: { 
          userId: userId,
          date: { 
            $gte: `${sixMonthsAgo.getFullYear()}-${String(sixMonthsAgo.getMonth() + 1).padStart(2, '0')}-01` 
          } 
        } 
      },
      {
        $group: {
          _id: { $substr: ['$date', 0, 7] }, // Group by YYYY-MM
          total: { $sum: { $toDouble: { $replaceAll: { input: '$amount', find: '₹', replacement: '' } } } }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.json({
      totalExpenses: expenses.length,
      totalAmount,
      categories: categories.map(c => ({ category: c._id, count: c.count, total: c.total })),
      monthlyTrend: monthlyExpenses.map(m => ({ month: m._id, total: m.total }))
    });
  } catch (error) {
    console.error('Error fetching expense statistics:', error);
    res.status(500).json({ error: 'Failed to fetch expense statistics' });
  }
});

export default router;