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
    'transactions in', 'spending in category', 'money spent on', 'category expenses', 
    'show me my spending'
  ],
  [FinanceIntent.SAVING_ADVICE]: [
    'how can i save', 'saving tips', 'save money', 'savings advice',
    'ways to save', 'increase savings', 'save more', 'recommend savings',
    'help me save', 'tips for reducing', 'reduce costs', 'lower expenses', 
    'cut spending', 'spend less on', 'saving on', 'reducing cost', 
    'give me tips', 'advice for cutting', 'how to cut down'
  ],
  [FinanceIntent.DEBT_PAYOFF]: [
    'pay off debt', 'reduce debt', 'debt strategy', 'debt payoff',
    'pay down loans', 'credit card debt', 'debt free', 'loan repayment',
    'pay off loans', 'debt reduction', 'manage debt', 'best way to pay off'
  ],
  [FinanceIntent.INVESTMENT_ADVICE]: [
    'investment', 'invest', 'stocks', 'bonds', 'where should i invest',
    'portfolio', 'investment strategy', 'investment advice', 'investment options',
    'how to invest', 'investment recommendations', 'how should i invest'
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

  // Extract categories first - this helps with more accurate intent detection
  const categoryMatches = CATEGORIES.filter(category => 
    normalizedQuery.includes(category)
  );
  
  if (categoryMatches.length > 0) {
    result.entities.category = categoryMatches[0];
    result.confidence += 0.1;
    
    // If we have a category related to entertainment and it mentions reducing/saving
    // we can directly set the intent to saving advice
    if ((categoryMatches[0] === 'entertainment' || categoryMatches[0] === 'streaming') && 
        (normalizedQuery.includes('reduce') || 
         normalizedQuery.includes('cut') || 
         normalizedQuery.includes('save') || 
         normalizedQuery.includes('saving') || 
         normalizedQuery.includes('tips') || 
         normalizedQuery.includes('advice') ||
         normalizedQuery.includes('lower'))) {
      result.intent = FinanceIntent.SAVING_ADVICE;
      result.confidence = 0.9;
    }
  }
  
  // Only proceed with normal pattern matching if we haven't already assigned a high-confidence intent
  if (result.intent === FinanceIntent.UNKNOWN || result.confidence < 0.8) {
    // Detect intent
    for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
      for (const pattern of patterns) {
        if (normalizedQuery.includes(pattern)) {
          result.intent = intent;
          result.confidence = Math.max(result.confidence, 0.7); // Base confidence
          
          // Increase confidence if it's a strong match
          if (normalizedQuery.startsWith(pattern)) {
            result.confidence += 0.2;
          }
          
          // If we didn't already find categories, check again
          if (!result.entities.category) {
            const categoryMatches = CATEGORIES.filter(category => 
              normalizedQuery.includes(category)
            );
            
            if (categoryMatches.length > 0) {
              result.entities.category = categoryMatches[0];
              result.confidence += 0.1;
            }
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
      if (entities.category === 'food' || entities.category === 'dining' || entities.category === 'restaurant') {
        return `Here are specific ways to save on food expenses:
        
1. Meal planning: Plan your meals for the week and make a grocery list to avoid impulse purchases.
2. Cook in batches: Prepare large portions and freeze leftovers to reduce the temptation to eat out.
3. Use cashback apps: Apps like Ibotta or Rakuten offer cashback on grocery purchases.
4. Bring lunch to work: This alone can save you $50-100 per week compared to buying lunch daily.
5. Limit dining out: Try reducing restaurant meals by 25% and put the savings toward your financial goals.`;
      } else if (entities.category === 'entertainment' || entities.category === 'streaming') {
        return `Here are specific ways to save on entertainment expenses:
        
1. Subscription audit: Review all streaming services and cancel ones you rarely use.
2. Rotation strategy: Keep only 1-2 services active at a time, switching every few months.
3. Use free alternatives: Explore library cards for free books, movies, and sometimes even museum passes.
4. Look for discounts: Many entertainment venues offer discounts on off-peak days or times.
5. Share subscriptions: Consider family plans for services you use regularly.`;
      } else if (entities.category === 'shopping' || entities.category === 'clothing') {
        return `Here are specific ways to save on shopping expenses:
        
1. Wait 24 hours: Before making non-essential purchases, wait a day to avoid impulse buying.
2. Capsule wardrobe: Focus on versatile items that can be mixed and matched.
3. Seasonal shopping: Buy winter clothes in spring and summer clothes in fall for major discounts.
4. Quality over quantity: Invest in fewer, higher-quality items that last longer.
5. Second-hand options: Consider thrift stores or online marketplaces for gently used items.`;
      } else {
        return `Here are 5 effective money-saving strategies based on common spending patterns:
        
1. Follow the 50/30/20 rule: Allocate 50% of income to needs, 30% to wants, and 20% to savings and debt repayment.
2. Automate your savings: Set up automatic transfers to savings accounts on payday before you have a chance to spend it.
3. Review and cancel unused subscriptions: The average person wastes $273 annually on forgotten subscriptions.
4. Use the 24-hour rule for purchases: Wait a day before buying non-essential items to prevent impulse spending.
5. Meal plan and cook at home: You can save up to 70% on food costs by reducing restaurant meals and planning grocery shopping.`;
      }
      
    case FinanceIntent.DEBT_PAYOFF:
      return `Here's a recommended debt payoff strategy based on best financial practices:
      
1. List all your debts with their interest rates and minimum payments.
2. While making minimum payments on all debts, put extra money toward either:
   - The highest interest debt first (avalanche method) to minimize interest costs
   - The smallest debt first (snowball method) for psychological wins
3. Once a debt is paid off, roll that payment amount to the next debt.
4. Consider balance transfer offers for high-interest credit card debt.
5. For student loans, look into income-driven repayment plans or refinancing options.`;
      
    case FinanceIntent.INVESTMENT_ADVICE:
      return `Here are key investment principles to consider for your financial situation:
      
1. Start with an emergency fund: Have 3-6 months of expenses saved before investing heavily.
2. Take advantage of tax-advantaged accounts: Maximize contributions to 401(k)s (especially if employer-matched) and IRAs.
3. Diversify across asset classes: Consider a mix of stocks, bonds, and other assets based on your risk tolerance and time horizon.
4. Keep costs low: Look for low-fee index funds rather than actively managed funds.
5. Invest regularly: Dollar-cost averaging helps reduce the impact of market volatility.`;
      
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