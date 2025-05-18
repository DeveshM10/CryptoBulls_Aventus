import { Request, Response } from 'express';

/**
 * Process voice transcripts and extract relevant financial data
 */
export async function processVoiceInput(req: Request, res: Response) {
  try {
    const { transcript, type } = req.body;

    if (!transcript) {
      return res.status(400).json({ error: 'No transcript provided' });
    }

    if (!type || (type !== 'asset' && type !== 'liability')) {
      return res.status(400).json({ error: 'Invalid type specified' });
    }

    // Process the transcript to extract relevant data
    const extractedData = type === 'asset' 
      ? extractAssetData(transcript) 
      : extractLiabilityData(transcript);

    return res.status(200).json(extractedData);
  } catch (error) {
    console.error('Error processing voice input:', error);
    return res.status(500).json({ error: 'Failed to process voice input' });
  }
}

/**
 * Extract asset-related information from a transcript
 */
function extractAssetData(transcript: string) {
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
  let trend = 'up';
  
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
  
  // Return the extracted data
  return {
    title: title || 'Unnamed Asset',
    value: value || '₹0',
    type: type,
    date: new Date().toISOString().split('T')[0],
    change: change,
    trend: trend,
  };
}

/**
 * Extract liability-related information from a transcript
 */
function extractLiabilityData(transcript: string) {
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
  
  // Extract due date
  let dueDate = '';
  const today = new Date();
  const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 
                       'july', 'august', 'september', 'october', 'november', 'december'];
  
  // Try to find a specific date mentioned
  const datePattern = /due (?:on|date|by) ([0-9]{1,2})(?:st|nd|rd|th)? (?:of )?(january|february|march|april|may|june|july|august|september|october|november|december)/i;
  const dateMatch = lowerTranscript.match(datePattern);
  
  if (dateMatch && dateMatch[1] && dateMatch[2]) {
    const day = parseInt(dateMatch[1]);
    const monthIndex = monthNames.indexOf(dateMatch[2].toLowerCase());
    
    if (day > 0 && day <= 31 && monthIndex !== -1) {
      const year = today.getFullYear();
      const date = new Date(year, monthIndex, day);
      
      // If the date is in the past, assume next year
      if (date < today) {
        date.setFullYear(year + 1);
      }
      
      dueDate = date.toISOString().split('T')[0];
    }
  }
  
  // If no specific date found, try to find "the Nth of each month"
  if (!dueDate) {
    const monthlyPattern = /due (?:on|date|by) (?:the )?([0-9]{1,2})(?:st|nd|rd|th)?(?: of each month| of every month| monthly)/i;
    const monthlyMatch = lowerTranscript.match(monthlyPattern);
    
    if (monthlyMatch && monthlyMatch[1]) {
      const day = parseInt(monthlyMatch[1]);
      if (day > 0 && day <= 31) {
        const year = today.getFullYear();
        const month = today.getMonth();
        let date = new Date(year, month, day);
        
        // If the date is in the past this month, use next month
        if (date < today) {
          date = new Date(year, month + 1, day);
        }
        
        dueDate = date.toISOString().split('T')[0];
      }
    }
  }
  
  // Default to 15 days from today if no date found
  if (!dueDate) {
    const defaultDueDate = new Date();
    defaultDueDate.setDate(today.getDate() + 15);
    dueDate = defaultDueDate.toISOString().split('T')[0];
  }
  
  // Determine status based on due date
  let status = 'current';
  const dueDateTime = new Date(dueDate).getTime();
  const todayTime = today.getTime();
  const fiveDaysMs = 5 * 24 * 60 * 60 * 1000;
  
  if (dueDateTime < todayTime) {
    status = 'late';
  } else if (dueDateTime - todayTime < fiveDaysMs) {
    status = 'warning';
  }
  
  // Return the extracted data
  return {
    title: title || 'Unnamed Liability',
    amount: amount || '₹0',
    type: type,
    interest: interest,
    payment: payment || '₹0',
    dueDate: dueDate,
    status: status,
  };
}