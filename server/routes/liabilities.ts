import { Request, Response, Router } from 'express';
import { Liability, ILiability } from '../models';
import mongoose from 'mongoose';

const router = Router();

// Get all liabilities
router.get('/', async (req: Request, res: Response) => {
  try {
    // In a real app, this would filter by the authenticated user's ID
    // For now, we'll just return all liabilities or can use a query parameter
    const userId = req.query.userId || null;
    
    let query = {};
    if (userId && mongoose.Types.ObjectId.isValid(userId as string)) {
      query = { userId: userId };
    }
    
    const liabilities = await Liability.find(query).sort({ createdAt: -1 });
    res.status(200).json(liabilities);
  } catch (error) {
    console.error('Error fetching liabilities:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single liability by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const liability = await Liability.findById(req.params.id);
    
    if (!liability) {
      return res.status(404).json({ message: 'Liability not found' });
    }
    
    res.status(200).json(liability);
  } catch (error) {
    console.error('Error fetching liability:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new liability
router.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, title, amount, type, interest, payment, dueDate, status } = req.body;
    
    if (!userId || !title || !amount || !type || !interest || !payment || !dueDate || !status) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    const newLiability = new Liability({
      userId,
      title,
      amount,
      type,
      interest,
      payment,
      dueDate,
      status
    });
    
    const savedLiability = await newLiability.save();
    res.status(201).json(savedLiability);
  } catch (error) {
    console.error('Error creating liability:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a liability
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { title, amount, type, interest, payment, dueDate, status } = req.body;
    
    const updatedLiability = await Liability.findByIdAndUpdate(
      req.params.id,
      { title, amount, type, interest, payment, dueDate, status },
      { new: true, runValidators: true }
    );
    
    if (!updatedLiability) {
      return res.status(404).json({ message: 'Liability not found' });
    }
    
    res.status(200).json(updatedLiability);
  } catch (error) {
    console.error('Error updating liability:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a liability
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deletedLiability = await Liability.findByIdAndDelete(req.params.id);
    
    if (!deletedLiability) {
      return res.status(404).json({ message: 'Liability not found' });
    }
    
    res.status(200).json({ message: 'Liability deleted successfully' });
  } catch (error) {
    console.error('Error deleting liability:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;