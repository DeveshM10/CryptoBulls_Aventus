/**
 * Voice-based financial query analyzer
 * 
 * This module provides a lightweight, offline natural language processing system
 * for analyzing voice queries related to personal finance.
 */

// Types
export interface FinanceQueryResult {
  intent: string;
  confidence: number;
  entities: {
    [key: string]: any;
  };
  response: string;
}

// Common financial intents
export enum FinanceIntent {
  GET_BALANCE = 'get_balance',
  CHECK_BUDGET = 'check_budget',
  SPENDING_CATEGORY = 'spending_category',
  SAVING_ADVICE = 'saving_advice',
  DEBT_PAYOFF = 'debt_payoff',
  INVESTMENT_ADVICE = 'investment_advice',
  UNKNOWN = 'unknown'
}

// Keywords and phrases for intent recognition
const INTENT_PATTERNS = {
  [FinanceIntent.GET_BALANCE]: [
    'what is my balance', 'how much money do i have', 'show me my balance',
    'what are my assets', 'my total assets', 'net worth', 'what is my net worth',
    'how much am i worth', 'assets and liabilities'
  ],
  [FinanceIntent.CHECK_BUDGET]: [
    'budget', 'spending', 'how much have i spent', 'budget status',
    'am i over budget', 'budget progress', 'budget remaining', 'how am i doing on my budget',
    'budget health', 'expense tracking'
  ],
  [FinanceIntent.SPENDING_CATEGORY]: [
    'spending on', 'how much did i spend on', 'expenses for', 'category spending',
    'transactions in', 'spending in category', 'money spent on', 'category expenses'
  ],
  [FinanceIntent.SAVING_ADVICE]: [
    'how can i save', 'saving tips', 'save money', 'savings advice',
    'ways to save', 'increase savings', 'save more', 'recommend savings',
    'help me save'
  ],
  [FinanceIntent.DEBT_PAYOFF]: [
    'pay off debt', 'reduce debt', 'debt strategy', 'debt payoff',
    'pay down loans', 'credit card debt', 'debt free', 'loan repayment',
    'pay off loans', 'debt reduction'
  ],
  [FinanceIntent.INVESTMENT_ADVICE]: [
    'investment', 'invest', 'stocks', 'bonds', 'where should i invest',
    'portfolio', 'investment strategy', 'investment advice', 'investment options',
    'how to invest', 'investment recommendations'
  ]
};

// Categories for entity extraction
const CATEGORIES = [
  'groceries', 'food', 'dining', 'restaurant', 'shopping', 'clothing',
  'entertainment', 'utilities', 'rent', 'mortgage', 'transportation',
  'car', 'gas', 'health', 'medical', 'insurance', 'education', 'travel',
  'gifts', 'subscriptions', 'streaming', 'electronics'
];

// Timeframes for entity extraction
const TIMEFRAMES = [
  {words: ['today', 'day'], value: 'today'},
  {words: ['yesterday'], value: 'yesterday'},
  {words: ['week', 'weekly', 'this week', 'past week', 'last week'], value: 'week'},
  {words: ['month', 'monthly', 'this month', 'past month', 'last month'], value: 'month'},
  {words: ['year', 'yearly', 'this year', 'past year', 'last year'], value: 'year'}
];

/**
 * Analyzes a financial query to determine intent and extract entities
 * 
 * @param query The user's query text (from voice transcription)
 * @returns Object containing identified intent, confidence score, entities, and response
 */
export function analyzeFinanceQuery(query: string): FinanceQueryResult {
  const normalizedQuery = query.toLowerCase().trim();
  
  // Default response
  let result: FinanceQueryResult = {
    intent: FinanceIntent.UNKNOWN,
    confidence: 0,
    entities: {},
    response: "I'm not sure how to help with that financial question."
  };
  
  // Detect intent
  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
    for (const pattern of patterns) {
      if (normalizedQuery.includes(pattern)) {
        result.intent = intent;
        result.confidence = 0.7; // Base confidence
        
        // Increase confidence if it's a strong match
        if (normalizedQuery.startsWith(pattern)) {
          result.confidence += 0.2;
        }
        
        // Check for categories
        const categoryMatches = CATEGORIES.filter(category => 
          normalizedQuery.includes(category)
        );
        
        if (categoryMatches.length > 0) {
          result.entities.category = categoryMatches[0];
          result.confidence += 0.1;
        }
        
        // Check for timeframes
        for (const timeframe of TIMEFRAMES) {
          const timeMatches = timeframe.words.filter(word => 
            normalizedQuery.includes(word)
          );
          
          if (timeMatches.length > 0) {
            result.entities.timeframe = timeframe.value;
            result.confidence += 0.1;
            break;
          }
        }
        
        // Break out of the loop once we've found a matching intent
        break;
      }
    }
    
    // If we found a high-confidence match, no need to check other intents
    if (result.intent !== FinanceIntent.UNKNOWN && result.confidence >= 0.8) {
      break;
    }
  }
  
  // Generate appropriate response based on intent and entities
  result.response = generateResponse(result);
  
  return result;
}

/**
 * Generates a natural language response based on the detected intent and entities
 */
function generateResponse(result: FinanceQueryResult): string {
  const { intent, entities } = result;
  
  switch (intent) {
    case FinanceIntent.GET_BALANCE:
      return "I'll show you a summary of your current balances and net worth.";
      
    case FinanceIntent.CHECK_BUDGET:
      if (entities.timeframe) {
        return `Here's your budget status for ${entities.timeframe}.`;
      }
      return "Here's your current budget progress across all categories.";
      
    case FinanceIntent.SPENDING_CATEGORY:
      if (entities.category && entities.timeframe) {
        return `I'll show your spending on ${entities.category} for ${entities.timeframe}.`;
      } else if (entities.category) {
        return `Here's your spending history for ${entities.category}.`;
      } else if (entities.timeframe) {
        return `I'll break down your spending categories for ${entities.timeframe}.`;
      }
      return "I can show your spending by category. Which category would you like to see?";
      
    case FinanceIntent.SAVING_ADVICE:
      if (entities.category) {
        return `Here are some tips to save money on ${entities.category} expenses.`;
      }
      return "Here are some personalized saving tips based on your spending patterns.";
      
    case FinanceIntent.DEBT_PAYOFF:
      return "Based on your current debts, here's a recommended payoff strategy.";
      
    case FinanceIntent.INVESTMENT_ADVICE:
      return "Here are some investment insights based on your financial situation.";
      
    default:
      return "I'm not sure how to help with that financial question. Try asking about your budget, spending, or saving tips.";
  }
}

/**
 * Extracts numbers from a query string
 * Used for identifying amounts in queries like "spent $50 on groceries"
 */
export function extractAmountFromQuery(query: string): number | null {
  // Look for dollar amounts: $50, 50 dollars
  const dollarRegex = /\$(\d+(\.\d+)?)|(\d+(\.\d+)?) dollars/;
  const dollarMatch = query.match(dollarRegex);
  
  if (dollarMatch) {
    // Extract the number portion
    return parseFloat(dollarMatch[1] || dollarMatch[3]);
  }
  
  // Look for standalone numbers as a fallback
  const numberRegex = /\b(\d+(\.\d+)?)\b/;
  const numberMatch = query.match(numberRegex);
  
  if (numberMatch) {
    return parseFloat(numberMatch[1]);
  }
  
  return null;
}