import express, { Request, Response } from 'express';
import Transaction from '../models/Transaction';

const router = express.Router();

// Get all transactions for the current user
router.get('/', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const transactions = await Transaction.find({ userId: req.user._id })
      .sort({ timestamp: -1 })
      .limit(50);
    
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Get a single transaction by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const transaction = await Transaction.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    res.json(transaction);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
});

// Create a new transaction
router.post('/', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { 
      amount, 
      description, 
      category, 
      merchantName,
      paymentMethod,
      location,
      deviceId,
      fraudScore,
      fraudFeatures
    } = req.body;

    // Create new transaction
    const newTransaction = new Transaction({
      userId: req.user._id,
      amount,
      description,
      category,
      merchantName,
      paymentMethod,
      location,
      deviceId,
      fraudScore: fraudScore || 0,
      fraudFeatures: fraudFeatures || {
        amountDeviation: 0,
        locationAnomaly: 0,
        timeAnomaly: 0,
        merchantAnomaly: 0,
        frequencyAnomaly: 0
      },
      status: fraudScore && fraudScore > 70 ? 'flagged' : 'completed',
      flaggedBy: fraudScore && fraudScore > 70 ? 'system' : null
    });
    
    const savedTransaction = await newTransaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// Update a transaction status (e.g., mark as fraudulent)
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { status, flaggedBy } = req.body;
    
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { 
        status, 
        flaggedBy: flaggedBy || 'user',
        ...(status === 'flagged' && { fraudScore: 100 }) // If marked as flagged, set fraud score to max
      },
      { new: true }
    );
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    res.json(transaction);
  } catch (error) {
    console.error('Error updating transaction status:', error);
    res.status(500).json({ error: 'Failed to update transaction status' });
  }
});

// Get transaction statistics for the current user
router.get('/stats/summary', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = req.user._id;
    
    // Get total number of transactions
    const totalCount = await Transaction.countDocuments({ userId });
    
    // Get count of flagged transactions
    const flaggedCount = await Transaction.countDocuments({ 
      userId, 
      status: 'flagged' 
    });
    
    // Get total amount transacted
    const transactions = await Transaction.find({ userId });
    const totalAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0);
    
    // Get transaction categories with counts
    const categories = await Transaction.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Get merchant with most transactions
    const merchants = await Transaction.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: '$merchantName', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);
    
    res.json({
      totalCount,
      flaggedCount,
      totalAmount,
      categories: categories.map(c => ({ category: c._id, count: c.count })),
      topMerchant: merchants.length > 0 ? merchants[0]._id : null
    });
  } catch (error) {
    console.error('Error fetching transaction statistics:', error);
    res.status(500).json({ error: 'Failed to fetch transaction statistics' });
  }
});

export default router;