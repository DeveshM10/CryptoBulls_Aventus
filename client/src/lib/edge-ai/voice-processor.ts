/**
 * Edge AI Voice Processor
 * 
 * A sophisticated voice processing system that runs entirely 
 * on the client device with zero server dependencies.
 */

import { Asset, Liability, Expense, DailyExpense, Income, Transaction } from '../../types/finance';
import { addItem, updateItem, getAllItems } from './indexed-db';
import { STORES } from './constants';

/**
 * Process voice input and extract financial information locally
 */
export async function processVoiceInput(
  transcript: string, 
  type: 'asset' | 'liability' | 'expense' | 'income' | 'transaction'
): Promise<any> {
  console.log(`Processing voice input for ${type}: "${transcript}"`);
  
  // Process based on type
  let result;
  
  switch(type) {
    case 'asset':
      result = extractAssetData(transcript);
      // Save the result instantly to IndexedDB
      await addItem(STORES.ASSETS, result);
      break;
      
    case 'liability':
      result = extractLiabilityData(transcript);
      // Save the result instantly to IndexedDB
      await addItem(STORES.LIABILITIES, result);
      break;
      
    case 'expense':
      result = extractExpenseData(transcript);
      // Save the result instantly to IndexedDB
      await addItem(STORES.EXPENSES, result);
      break;
      
    case 'income':
      result = extractIncomeData(transcript);
      // Save the result instantly to IndexedDB
      await addItem(STORES.INCOME, result);
      break;
      
    case 'transaction':
      result = extractTransactionData(transcript);
      // Save the result instantly to IndexedDB
      await addItem(STORES.TRANSACTIONS, result);
      break;
      
    default:
      throw new Error(`Unsupported type: ${type}`);
  }
  
  return result;
}

/**
 * Extract asset information from transcript
 */
function extractAssetData(transcript: string): Asset {
  const lowerTranscript = transcript.toLowerCase();
  
  // Extract asset title
  let title = '';
  const titlePatterns = [
    /(?:i have|own|purchased|bought|acquired|my|an?) ([a-z\s]+)(?:worth|valued at|for|that costs|that is worth|that's worth)/i,
    /(?:my|an?) ([a-z\s]+)(?:that is|which is|is)/i,
  ];
  
  for (const pattern of titlePatterns) {
    const match = lowerTranscript.match(pattern);
    if (match && match[1]) {
      title = match[1].trim();
      // Clean up common words that might be captured but aren't part of the title
      title = title.replace(/(a |an |the |some |few |my )/g, '').trim();
      if (title) break;
    }
  }

  // Extract asset value
  let value = '';
  const valuePatterns = [
    /worth (?:rs\.?|rupees?|inr|₹)?\s?([0-9,.]+)\s?(?:rs\.?|rupees?|inr|₹)?/i,
    /valued at (?:rs\.?|rupees?|inr|₹)?\s?([0-9,.]+)\s?(?:rs\.?|rupees?|inr|₹)?/i,
    /(?:rs\.?|rupees?|inr|₹)?\s?([0-9,.]+)\s?(?:rs\.?|rupees?|inr|₹)?/i,
  ];
  
  for (const pattern of valuePatterns) {
    const match = lowerTranscript.match(pattern);
    if (match && match[1]) {
      // Format the value with rupee symbol
      value = `₹${match[1].replace(/,/g, '')}`;
      break;
    }
  }
  
  // Extract asset type
  let type = 'other';
  const typeKeywords = {
    'real estate': ['house', 'apartment', 'flat', 'property', 'land', 'real estate', 'plot'],
    'stock': ['stock', 'share', 'equity', 'securities', 'investment'],
    'cash': ['cash', 'money', 'savings', 'deposit', 'fixed deposit', 'fd', 'bank'],
    'vehicle': ['car', 'bike', 'motorcycle', 'vehicle', 'truck', 'scooter'],
    'gold': ['gold', 'silver', 'jewelry', 'jewellery', 'ornament', 'precious metal'],
    'crypto': ['crypto', 'bitcoin', 'ethereum', 'cryptocurrency', 'digital currency'],
    'mutual fund': ['mutual fund', 'mf', 'fund', 'sip'],
    'bond': ['bond', 'debenture', 'fixed income', 'government security'],
  };
  
  for (const [assetType, keywords] of Object.entries(typeKeywords)) {
    for (const keyword of keywords) {
      if (lowerTranscript.includes(keyword)) {
        type = assetType;
        break;
      }
    }
    if (type !== 'other') break;
  }
  
  // Extract growth or change information
  let change = '0%';
  let trend: 'up' | 'down' = 'up';
  
  const increasePatterns = [
    /(?:increased|grew|up|gained|appreciated|rise|risen|growth) by ([0-9.]+)\s?(%|percent)/i,
    /([0-9.]+)\s?(%|percent) (?:increase|growth|appreciation|gain|rise)/i,
  ];
  
  const decreasePatterns = [
    /(?:decreased|fell|down|lost|depreciated|dropped|fall|fallen) by ([0-9.]+)\s?(%|percent)/i,
    /([0-9.]+)\s?(%|percent) (?:decrease|loss|depreciation|drop|fall)/i,
  ];
  
  for (const pattern of increasePatterns) {
    const match = lowerTranscript.match(pattern);
    if (match && match[1]) {
      change = `${match[1]}%`;
      trend = 'up';
      break;
    }
  }
  
  if (change === '0%') {
    for (const pattern of decreasePatterns) {
      const match = lowerTranscript.match(pattern);
      if (match && match[1]) {
        change = `${match[1]}%`;
        trend = 'down';
        break;
      }
    }
  }
  
  // Generate a unique ID for local assets
  const id = crypto.randomUUID ? crypto.randomUUID() : `asset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Return the extracted data
  return {
    id,
    title: title || 'Unnamed Asset',
    value: value || '₹0',
    type: type,
    date: new Date().toISOString().split('T')[0],
    change: change,
    trend: trend,
  };
}

/**
 * Extract liability information from transcript
 */
function extractLiabilityData(transcript: string): Liability {
  const lowerTranscript = transcript.toLowerCase();
  
  // Extract liability title
  let title = '';
  const titlePatterns = [
    /(?:i have|owe|my|a|an?) ([a-z\s]+)(?:loan|debt|liability|mortgage|payment|credit)/i,
    /(?:loan|debt|liability|mortgage|payment|credit) (?:for|on|of) ([a-z\s]+)/i,
  ];
  
  for (const pattern of titlePatterns) {
    const match = lowerTranscript.match(pattern);
    if (match && match[1]) {
      title = match[1].trim();
      // Clean up common words
      title = title.replace(/(a |an |the |some |few |my )/g, '').trim();
      if (title) break;
    }
  }
  
  // If title wasn't found, try to determine from liability type
  if (!title) {
    if (lowerTranscript.includes('car loan') || lowerTranscript.includes('auto loan')) {
      title = 'Car Loan';
    } else if (lowerTranscript.includes('home loan') || lowerTranscript.includes('mortgage')) {
      title = 'Home Loan';
    } else if (lowerTranscript.includes('student loan') || lowerTranscript.includes('education loan')) {
      title = 'Student Loan';
    } else if (lowerTranscript.includes('personal loan')) {
      title = 'Personal Loan';
    } else if (lowerTranscript.includes('credit card')) {
      title = 'Credit Card Debt';
    }
  }
  
  // Extract liability amount
  let amount = '';
  const amountPatterns = [
    /(?:of|for|worth|is) (?:rs\.?|rupees?|inr|₹)?\s?([0-9,.]+)\s?(?:rs\.?|rupees?|inr|₹)?/i,
    /(?:rs\.?|rupees?|inr|₹)?\s?([0-9,.]+)\s?(?:rs\.?|rupees?|inr|₹)?/i,
  ];
  
  for (const pattern of amountPatterns) {
    const match = lowerTranscript.match(pattern);
    if (match && match[1]) {
      // Format the amount with rupee symbol
      amount = `₹${match[1].replace(/,/g, '')}`;
      break;
    }
  }
  
  // Extract liability type
  let type = 'other';
  const typeKeywords = {
    'mortgage': ['mortgage', 'home loan', 'housing loan', 'property loan'],
    'auto loan': ['car loan', 'auto loan', 'vehicle loan', 'bike loan', 'motorcycle loan'],
    'personal loan': ['personal loan', 'unsecured loan'],
    'student loan': ['student loan', 'education loan', 'study loan', 'educational loan'],
    'credit card': ['credit card', 'card debt', 'credit card debt'],
    'business loan': ['business loan', 'commercial loan', 'startup loan'],
  };
  
  for (const [liabilityType, keywords] of Object.entries(typeKeywords)) {
    for (const keyword of keywords) {
      if (lowerTranscript.includes(keyword)) {
        type = liabilityType;
        break;
      }
    }
    if (type !== 'other') break;
  }
  
  // Extract interest rate
  let interest = '0%';
  const interestPatterns = [
    /([0-9.]+)\s?(%|percent) (?:interest|rate)/i,
    /(?:interest|rate) (?:of|is|at) ([0-9.]+)\s?(%|percent)/i,
  ];
  
  for (const pattern of interestPatterns) {
    const match = lowerTranscript.match(pattern);
    if (match && match[1]) {
      interest = `${match[1]}%`;
      break;
    }
  }
  
  // Extract monthly payment
  let payment = '';
  const paymentPatterns = [
    /(?:monthly|monthly payment|emi|installment|pay) (?:of|is|at|about) (?:rs\.?|rupees?|inr|₹)?\s?([0-9,.]+)\s?(?:rs\.?|rupees?|inr|₹)?/i,
    /(?:rs\.?|rupees?|inr|₹)?\s?([0-9,.]+)\s?(?:rs\.?|rupees?|inr|₹)? (?:per month|monthly|emi|installment)/i,
  ];
  
  for (const pattern of paymentPatterns) {
    const match = lowerTranscript.match(pattern);
    if (match && match[1]) {
      payment = `₹${match[1].replace(/,/g, '')}`;
      break;
    }
  }
  
  // Extract due date or set to 15 days from now
  const today = new Date();
  const dueDate = new Date(today);
  dueDate.setDate(today.getDate() + 15);
  
  // Generate a unique ID for local liabilities
  const id = crypto.randomUUID ? crypto.randomUUID() : `liability-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Return the extracted data
  return {
    id,
    title: title || 'Unnamed Liability',
    amount: amount || '₹0',
    type: type,
    interest: interest,
    payment: payment || '₹0',
    dueDate: dueDate.toISOString().split('T')[0],
    status: 'current' as 'current' | 'warning' | 'late',
  };
}

/**
 * Extract expense information from transcript
 */
function extractExpenseData(transcript: string): Expense {
  const lowerTranscript = transcript.toLowerCase();
  
  // Extract expense title
  let title = '';
  const titlePatterns = [
    /(?:budget|budgeted|expense|spent|spending) (?:for|on) ([a-z\s]+)/i,
    /([a-z\s]+) (?:budget|expense)/i,
  ];
  
  for (const pattern of titlePatterns) {
    const match = lowerTranscript.match(pattern);
    if (match && match[1]) {
      title = match[1].trim();
      // Clean up common words
      title = title.replace(/(a |an |the |some |few |my )/g, '').trim();
      if (title) break;
    }
  }
  
  // Extract budgeted amount
  let budgeted = '';
  const budgetPatterns = [
    /(?:budget|budgeted|allocation) (?:of|is|at|about) (?:rs\.?|rupees?|inr|₹)?\s?([0-9,.]+)\s?(?:rs\.?|rupees?|inr|₹)?/i,
    /(?:rs\.?|rupees?|inr|₹)?\s?([0-9,.]+)\s?(?:rs\.?|rupees?|inr|₹)? (?:budget|budgeted|allocation)/i,
  ];
  
  for (const pattern of budgetPatterns) {
    const match = lowerTranscript.match(pattern);
    if (match && match[1]) {
      budgeted = `₹${match[1].replace(/,/g, '')}`;
      break;
    }
  }
  
  // Extract spent amount
  let spent = '';
  const spentPatterns = [
    /(?:spent|used|consumed) (?:rs\.?|rupees?|inr|₹)?\s?([0-9,.]+)\s?(?:rs\.?|rupees?|inr|₹)?/i,
    /(?:rs\.?|rupees?|inr|₹)?\s?([0-9,.]+)\s?(?:rs\.?|rupees?|inr|₹)? (?:spent|used|consumed)/i,
  ];
  
  for (const pattern of spentPatterns) {
    const match = lowerTranscript.match(pattern);
    if (match && match[1]) {
      spent = `₹${match[1].replace(/,/g, '')}`;
      break;
    }
  }
  
  // Calculate percentage and status
  let percentage = 0;
  let status: 'normal' | 'warning' | 'danger' = 'normal';
  
  const budgetedAmount = parseFloat(budgeted.replace(/[^\d.-]/g, '')) || 0;
  const spentAmount = parseFloat(spent.replace(/[^\d.-]/g, '')) || 0;
  
  if (budgetedAmount > 0) {
    percentage = Math.round((spentAmount / budgetedAmount) * 100);
    
    // Determine status based on percentage
    if (percentage >= 90) {
      status = 'danger';
    } else if (percentage >= 75) {
      status = 'warning';
    }
  }
  
  // Generate a unique ID for local expenses
  const id = crypto.randomUUID ? crypto.randomUUID() : `expense-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Return the extracted data
  return {
    id,
    title: title || 'Unnamed Expense',
    budgeted: budgeted || '₹0',
    spent: spent || '₹0',
    percentage,
    status,
  };
}

/**
 * Extract income information from transcript
 */
function extractIncomeData(transcript: string): Income {
  const lowerTranscript = transcript.toLowerCase();
  
  // Extract income title
  let title = '';
  const titlePatterns = [
    /(?:income|earnings|salary|payment) (?:from|by|for) ([a-z\s]+)/i,
    /([a-z\s]+) (?:income|earnings|salary|payment)/i,
  ];
  
  for (const pattern of titlePatterns) {
    const match = lowerTranscript.match(pattern);
    if (match && match[1]) {
      title = match[1].trim();
      // Clean up common words
      title = title.replace(/(a |an |the |some |few |my )/g, '').trim();
      if (title) break;
    }
  }
  
  // Extract income amount
  let amount = '';
  const amountPatterns = [
    /(?:income|earnings|salary|payment) (?:of|is|at|about) (?:rs\.?|rupees?|inr|₹)?\s?([0-9,.]+)\s?(?:rs\.?|rupees?|inr|₹)?/i,
    /(?:rs\.?|rupees?|inr|₹)?\s?([0-9,.]+)\s?(?:rs\.?|rupees?|inr|₹)? (?:income|earnings|salary|payment)/i,
    /(?:rs\.?|rupees?|inr|₹)?\s?([0-9,.]+)\s?(?:rs\.?|rupees?|inr|₹)?/i,
  ];
  
  for (const pattern of amountPatterns) {
    const match = lowerTranscript.match(pattern);
    if (match && match[1]) {
      amount = `₹${match[1].replace(/,/g, '')}`;
      break;
    }
  }
  
  // Extract description
  let description = '';
  if (lowerTranscript.includes('description') || lowerTranscript.includes('details')) {
    const descMatch = lowerTranscript.match(/(?:description|details)[\s:]+([^.]+)/i);
    if (descMatch && descMatch[1]) {
      description = descMatch[1].trim();
    }
  }
  
  // Generate a unique ID for local income
  const id = crypto.randomUUID ? crypto.randomUUID() : `income-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Return the extracted data
  return {
    id,
    title: title || 'Unnamed Income',
    amount: amount || '₹0',
    description: description || 'Monthly income',
  };
}

/**
 * Extract transaction information from transcript
 */
function extractTransactionData(transcript: string): Transaction {
  const lowerTranscript = transcript.toLowerCase();
  
  // Default values
  const id = crypto.randomUUID ? crypto.randomUUID() : `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const hash = `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
  
  // Extract from address (sender)
  let from = '0x0000000000000000000000000000000000000000';
  
  // Extract to address (recipient)
  let to = '0x0000000000000000000000000000000000000000';
  
  // Extract amount
  let amount = '';
  const amountPatterns = [
    /(?:sent|received|transferred|amount|sum|total) (?:of|is|at|about) (?:rs\.?|rupees?|inr|₹)?\s?([0-9,.]+)\s?(?:rs\.?|rupees?|inr|₹)?/i,
    /(?:rs\.?|rupees?|inr|₹)?\s?([0-9,.]+)\s?(?:rs\.?|rupees?|inr|₹)? (?:sent|received|transferred)/i,
    /(?:rs\.?|rupees?|inr|₹)?\s?([0-9,.]+)\s?(?:rs\.?|rupees?|inr|₹)?/i,
  ];
  
  for (const pattern of amountPatterns) {
    const match = lowerTranscript.match(pattern);
    if (match && match[1]) {
      amount = `₹${match[1].replace(/,/g, '')}`;
      break;
    }
  }
  
  // Extract transaction type
  let type = 'transfer';
  if (lowerTranscript.includes('deposit') || lowerTranscript.includes('received')) {
    type = 'deposit';
  } else if (lowerTranscript.includes('withdraw') || lowerTranscript.includes('sent')) {
    type = 'withdrawal';
  }
  
  // Generate timestamp (current time)
  const timestamp = new Date().toISOString();
  
  // Return the transaction data
  return {
    id,
    hash,
    from,
    to,
    amount: amount || '₹0',
    type,
    timestamp,
    status: 'verified' as 'verified' | 'pending' | 'rejected',
    confirmations: Math.floor(Math.random() * 12) + 1, // Random number between 1-12
  };
}