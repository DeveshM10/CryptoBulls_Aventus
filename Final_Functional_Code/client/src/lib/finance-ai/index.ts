/**
 * FinVault AI Finance Assistant
 * 
 * This module provides AI-powered financial analysis that runs entirely
 * in the browser for privacy and offline capabilities.
 */

// Types for the Finance Assistant
export interface FinanceInsight {
  id: string;
  type: 'alert' | 'tip' | 'anomaly' | 'achievement';
  title: string;
  description: string;
  category?: string;
  severity?: 'low' | 'medium' | 'high';
  timestamp: Date;
  actionable: boolean;
  action?: {
    label: string;
    url?: string;
    callback?: () => void;
  };
}

export interface SpendingAnomalyParams {
  threshold: number; // Percentage above average to trigger anomaly
  timeframe: 'week' | 'month'; // Timeframe to analyze
  minTransactions: number; // Minimum number of transactions needed for analysis
}

export interface SavingOpportunityParams {
  categories: string[]; // Categories to analyze
  threshold: number; // Percentage that can be saved
  minAmount: number; // Minimum amount to flag as opportunity
}

// Default parameters for analysis
const DEFAULT_ANOMALY_PARAMS: SpendingAnomalyParams = {
  threshold: 50, // 50% above average
  timeframe: 'week',
  minTransactions: 5
};

const DEFAULT_SAVING_PARAMS: SavingOpportunityParams = {
  categories: ['dining', 'entertainment', 'shopping'],
  threshold: 20, // 20% saving opportunity
  minAmount: 100
};

/**
 * Finance Assistant class - provides offline financial insights
 */
export class FinanceAssistant {
  private expenses: any[] = [];
  private insights: FinanceInsight[] = [];
  private categoryAverages: Map<string, number> = new Map();
  private weeklySpending: Map<string, number> = new Map();
  private lastAnalysisDate: Date | null = null;
  
  constructor() {
    // Initialize with empty data
    this.analyzeData();
  }
  
  /**
   * Load financial data from the provided expenses
   */
  public loadData(expenses: any[]): void {
    this.expenses = [...expenses];
    this.analyzeData();
  }
  
  /**
   * Perform basic statistical analysis on expenses
   */
  private analyzeData(): void {
    if (this.expenses.length === 0) return;
    
    // Reset analysis data
    this.categoryAverages = new Map();
    this.weeklySpending = new Map();
    
    // Group expenses by category
    const categoryExpenses: Record<string, number[]> = {};
    
    // Process expenses
    this.expenses.forEach(expense => {
      // Process by category
      if (!categoryExpenses[expense.category]) {
        categoryExpenses[expense.category] = [];
      }
      categoryExpenses[expense.category].push(parseFloat(expense.amount));
      
      // Process by week
      const expenseDate = new Date(expense.date);
      const weekKey = this.getWeekKey(expenseDate);
      
      if (!this.weeklySpending.has(weekKey)) {
        this.weeklySpending.set(weekKey, 0);
      }
      this.weeklySpending.set(
        weekKey, 
        this.weeklySpending.get(weekKey)! + parseFloat(expense.amount)
      );
    });
    
    // Calculate category averages
    Object.entries(categoryExpenses).forEach(([category, amounts]) => {
      const sum = amounts.reduce((acc, amount) => acc + amount, 0);
      const average = sum / amounts.length;
      this.categoryAverages.set(category, average);
    });
    
    this.lastAnalysisDate = new Date();
  }
  
  /**
   * Get a string key representing the week of a date
   */
  private getWeekKey(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const firstDayOfYear = new Date(year, 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    
    return `${year}-W${weekNumber}`;
  }
  
  /**
   * Check if data needs refreshing
   */
  private needsRefresh(): boolean {
    if (!this.lastAnalysisDate) return true;
    
    const now = new Date();
    const hoursSinceLastAnalysis = 
      (now.getTime() - this.lastAnalysisDate.getTime()) / (1000 * 60 * 60);
    
    return hoursSinceLastAnalysis > 6; // Refresh every 6 hours
  }
  
  /**
   * Detect spending anomalies based on historical data
   */
  public detectSpendingAnomalies(
    params: Partial<SpendingAnomalyParams> = {}
  ): FinanceInsight[] {
    const config = { ...DEFAULT_ANOMALY_PARAMS, ...params };
    const anomalies: FinanceInsight[] = [];
    
    // Need minimum amount of data
    if (this.expenses.length < config.minTransactions) {
      return anomalies;
    }
    
    // Group recent expenses by category
    const recentExpensesByCategory: Record<string, number[]> = {};
    const now = new Date();
    const timeframeDays = config.timeframe === 'week' ? 7 : 30;
    const cutoffDate = new Date(now.setDate(now.getDate() - timeframeDays));
    
    this.expenses.forEach(expense => {
      const expenseDate = new Date(expense.date);
      if (expenseDate >= cutoffDate) {
        if (!recentExpensesByCategory[expense.category]) {
          recentExpensesByCategory[expense.category] = [];
        }
        recentExpensesByCategory[expense.category].push(parseFloat(expense.amount));
      }
    });
    
    // Compare recent expenses to category averages
    Object.entries(recentExpensesByCategory).forEach(([category, amounts]) => {
      const categoryAverage = this.categoryAverages.get(category) || 0;
      if (categoryAverage === 0) return; // Skip categories with no average
      
      // Calculate average of recent expenses
      const recentTotal = amounts.reduce((sum, amount) => sum + amount, 0);
      const recentAverage = recentTotal / amounts.length;
      
      // Check if recent average exceeds threshold
      if (recentAverage > categoryAverage * (1 + config.threshold/100)) {
        const percentIncrease = Math.round((recentAverage / categoryAverage - 1) * 100);
        
        anomalies.push({
          id: `anomaly-${category}-${Date.now()}`,
          type: 'anomaly',
          title: `Unusual spending in ${category}`,
          description: `Your recent ${category} spending is ${percentIncrease}% higher than your usual average.`,
          category,
          severity: percentIncrease > 100 ? 'high' : percentIncrease > 50 ? 'medium' : 'low',
          timestamp: new Date(),
          actionable: true,
          action: {
            label: 'View Details'
          }
        });
      }
    });
    
    return anomalies;
  }
  
  /**
   * Find potential saving opportunities
   */
  public findSavingOpportunities(
    params: Partial<SavingOpportunityParams> = {}
  ): FinanceInsight[] {
    const config = { ...DEFAULT_SAVING_PARAMS, ...params };
    const opportunities: FinanceInsight[] = [];
    
    // Always provide at least some meaningful tips even with limited data
    if (this.expenses.length < 3) {
      // Add generic tips when little expense data is available
      opportunities.push({
        id: `saving-general-${Date.now()}`,
        type: 'tip',
        title: 'Start tracking expenses by category',
        description: 'To identify saving opportunities, begin by categorizing your expenses. This will help you see where your money is going and find areas to cut back.',
        severity: 'medium',
        timestamp: new Date(),
        actionable: true,
        action: {
          label: 'Learn How'
        }
      });
      
      opportunities.push({
        id: `saving-50-30-20-${Date.now()}`,
        type: 'tip',
        title: 'Consider the 50/30/20 budget rule',
        description: 'A simple way to budget is the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings and debt repayment.',
        severity: 'low',
        timestamp: new Date(),
        actionable: true,
        action: {
          label: 'Learn More'
        }
      });
      
      return opportunities;
    }
    
    // Calculate total spending by category for the last month
    const categorySpending: Record<string, number> = {};
    const now = new Date();
    const monthAgo = new Date(now.setDate(now.getDate() - 30));
    
    // Extract all categories from expenses, not just the predefined ones
    const allCategories = new Set<string>();
    
    this.expenses.forEach(expense => {
      if (!expense.category) return;
      
      const category = expense.category.toLowerCase();
      allCategories.add(category);
      
      const expenseDate = new Date(expense.date);
      if (expenseDate >= monthAgo) {
        if (!categorySpending[category]) {
          categorySpending[category] = 0;
        }
        categorySpending[category] += parseFloat(expense.amount);
      }
    });
    
    // Check for saving opportunities across all categories
    Object.entries(categorySpending).forEach(([category, totalSpent]) => {
      if (totalSpent >= config.minAmount / 2) { // Lower threshold to be more helpful
        const potentialSaving = Math.round(totalSpent * (config.threshold / 100));
        
        if (potentialSaving >= 10) { // Provide more tips by lowering the threshold
          opportunities.push({
            id: `saving-${category}-${Date.now()}`,
            type: 'tip',
            title: `Saving opportunity in ${category}`,
            description: `Based on your spending patterns, you could save approximately $${potentialSaving} by reducing your ${category} expenses by ${config.threshold}%.`,
            category,
            severity: totalSpent > config.minAmount ? 'medium' : 'low',
            timestamp: new Date(),
            actionable: true,
            action: {
              label: 'Get Tips'
            }
          });
        }
      }
    });
    
    // Add category-specific advice based on spending patterns
    if (categorySpending['dining'] || categorySpending['food'] || categorySpending['restaurant']) {
      opportunities.push({
        id: `saving-food-${Date.now()}`,
        type: 'tip',
        title: 'Reduce food expenses',
        description: 'Try meal planning and cooking at home more often. You could save up to 70% compared to eating out regularly.',
        category: 'dining',
        severity: 'medium',
        timestamp: new Date(),
        actionable: true,
        action: {
          label: 'Get Meal Ideas'
        }
      });
    }
    
    if (categorySpending['entertainment'] || categorySpending['streaming']) {
      opportunities.push({
        id: `saving-entertainment-${Date.now()}`,
        type: 'tip',
        title: 'Optimize subscription services',
        description: 'Review your streaming subscriptions and consider rotating services instead of having them all at once.',
        category: 'entertainment',
        severity: 'low',
        timestamp: new Date(),
        actionable: true,
        action: {
          label: 'View Subscriptions'
        }
      });
    }
    
    // If we still don't have any opportunities, add generic ones
    if (opportunities.length === 0) {
      opportunities.push({
        id: `saving-general-${Date.now()}`,
        type: 'tip',
        title: 'Implement the 50/30/20 Budget Rule',
        description: 'Consider allocating 50% of income to necessities, 30% to wants, and 20% to savings and debt repayment.',
        severity: 'medium',
        timestamp: new Date(),
        actionable: true,
        action: {
          label: 'Learn More'
        }
      });
      
      opportunities.push({
        id: `saving-automate-${Date.now()}`,
        type: 'tip',
        title: 'Automate your savings',
        description: 'Set up automatic transfers to your savings account on payday to build savings without thinking about it.',
        severity: 'medium',
        timestamp: new Date(),
        actionable: true,
        action: {
          label: 'How To Automate'
        }
      });
    }
    
    return opportunities;
  }
  
  /**
   * Track budget adherence and provide insights
   */
  public analyzeBudgetAdherence(budgets: any[]): FinanceInsight[] {
    const insights: FinanceInsight[] = [];
    
    if (budgets.length === 0) return insights;
    
    // Compare actual spending to budgeted amounts
    budgets.forEach(budget => {
      const category = budget.title.toLowerCase();
      const budgeted = parseFloat(budget.budgeted);
      const spent = parseFloat(budget.spent);
      const percentage = budget.percentage;
      
      if (percentage > 90 && percentage < 100) {
        insights.push({
          id: `budget-warning-${category}-${Date.now()}`,
          type: 'alert',
          title: `Budget limit approaching`,
          description: `You've used ${percentage}% of your ${budget.title} budget.`,
          category,
          severity: 'medium',
          timestamp: new Date(),
          actionable: true,
          action: {
            label: 'View Budget'
          }
        });
      } else if (percentage >= 100) {
        const overage = Math.round((percentage - 100) * budgeted / 100);
        
        insights.push({
          id: `budget-exceeded-${category}-${Date.now()}`,
          type: 'alert',
          title: `Budget exceeded`,
          description: `You've exceeded your ${budget.title} budget by $${overage}.`,
          category,
          severity: 'high',
          timestamp: new Date(),
          actionable: true,
          action: {
            label: 'Adjust Budget'
          }
        });
      }
    });
    
    return insights;
  }
  
  /**
   * Get all financial insights
   */
  public getAllInsights(expenses: any[], budgets: any[]): FinanceInsight[] {
    // Update data
    this.loadData(expenses);
    
    const anomalies = this.detectSpendingAnomalies();
    const savingOpportunities = this.findSavingOpportunities();
    const budgetInsights = this.analyzeBudgetAdherence(budgets);
    
    return [...anomalies, ...savingOpportunities, ...budgetInsights];
  }
  
  /**
   * Generate a financial health score (0-100)
   */
  public calculateFinancialHealthScore(
    expenses: any[], 
    budgets: any[],
    income: number,
    totalAssets: number,
    totalLiabilities: number
  ): number {
    // Base score
    let score = 70;
    
    // Factor 1: Budget adherence
    if (budgets.length > 0) {
      const overBudgetCount = budgets.filter(e => e.percentage > 100).length;
      score -= (overBudgetCount / budgets.length) * 20;
    }
    
    // Factor 2: Savings ratio
    const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    if (income > 0) {
      const savingsRatio = (income - totalExpenses) / income;
      if (savingsRatio > 0.2) score += 15;
      else if (savingsRatio > 0.1) score += 10;
      else if (savingsRatio > 0) score += 5;
      else score -= 10;
    }
    
    // Factor 3: Net worth trend
    if (totalAssets > 0 && totalLiabilities > 0) {
      const debtToAssetRatio = totalLiabilities / totalAssets;
      if (debtToAssetRatio < 0.3) score += 15;
      else if (debtToAssetRatio < 0.5) score += 10;
      else if (debtToAssetRatio < 0.7) score += 5;
      else if (debtToAssetRatio > 1) score -= 10;
    }
    
    // Ensure score is within 0-100 range
    return Math.min(100, Math.max(0, Math.round(score)));
  }
  
  /**
   * Generate personalized financial tips
   */
  public getPersonalizedTips(
    expenses: any[],
    assets: any[],
    liabilities: any[]
  ): FinanceInsight[] {
    const tips: FinanceInsight[] = [];
    
    // Always provide meaningful tips even with limited data
    if (expenses.length === 0 && assets.length === 0 && liabilities.length === 0) {
      tips.push({
        id: `tip-budget-${Date.now()}`,
        type: 'tip',
        title: 'Create a personal budget',
        description: 'The foundation of financial success is a clear budget. Start by tracking your income and expenses to understand your spending patterns.',
        severity: 'high',
        timestamp: new Date(),
        actionable: true,
        action: {
          label: 'Budget Template'
        }
      });
      
      tips.push({
        id: `tip-emergency-fund-${Date.now()}`,
        type: 'tip',
        title: 'Start an emergency fund',
        description: 'Before investing or paying off low-interest debt, build an emergency fund covering 3-6 months of essential expenses.',
        severity: 'high',
        timestamp: new Date(),
        actionable: true,
        action: {
          label: 'Learn More'
        }
      });
      
      tips.push({
        id: `tip-goals-${Date.now()}`,
        type: 'tip',
        title: 'Set clear financial goals',
        description: 'Defining specific, measurable financial goals will help guide your saving and spending decisions.',
        severity: 'medium',
        timestamp: new Date(),
        actionable: true,
        action: {
          label: 'Goal Setting Guide'
        }
      });
      
      return tips;
    }
    
    // Calculate monthly expenses
    const totalMonthlyExpenses = expenses.reduce(
      (sum, expense) => sum + parseFloat(expense.amount || '0'), 0
    ) / 12; // Assuming annual or convert as needed
    
    // Tip: Emergency fund
    let hasLiquidAssets = false;
    const liquidAssets = assets
      .filter(a => {
        const type = (a.type || '').toLowerCase();
        return ['cash', 'savings', 'checking'].includes(type);
      })
      .reduce((sum, asset) => {
        hasLiquidAssets = true;
        return sum + parseFloat(asset.value || '0');
      }, 0);
    
    if (!hasLiquidAssets || liquidAssets < totalMonthlyExpenses * 3) {
      tips.push({
        id: `tip-emergency-fund-${Date.now()}`,
        type: 'tip',
        title: 'Build an emergency fund',
        description: 'Financial experts recommend saving 3-6 months of expenses in easily accessible accounts to handle unexpected costs.',
        severity: 'medium',
        timestamp: new Date(),
        actionable: true,
        action: {
          label: 'Learn More'
        }
      });
    }
    
    // Tip: High-interest debt
    let hasHighInterestDebt = false;
    const highInterestDebt = liabilities
      .filter(l => {
        const interest = parseFloat(l.interest || '0');
        hasHighInterestDebt = hasHighInterestDebt || interest > 10;
        return interest > 10;
      })
      .reduce((sum, liability) => sum + parseFloat(liability.amount || '0'), 0);
    
    if (hasHighInterestDebt) {
      tips.push({
        id: `tip-high-interest-debt-${Date.now()}`,
        type: 'tip',
        title: 'Prioritize high-interest debt',
        description: 'Pay down debts with interest rates above 10% first to minimize interest costs and improve your financial health.',
        severity: 'high',
        timestamp: new Date(),
        actionable: true,
        action: {
          label: 'Get Strategy'
        }
      });
    }
    
    // Tip: Diversification
    const investmentAssets = assets.filter(a => {
      const type = (a.type || '').toLowerCase();
      return ['stocks', 'bonds', 'crypto', 'etf', 'mutual fund', 'investment'].includes(type);
    });
    
    const investmentTypes = new Set(
      investmentAssets.map(a => (a.type || '').toLowerCase())
    );
    
    if (investmentTypes.size < 2 && assets.length > 0) {
      tips.push({
        id: `tip-diversification-${Date.now()}`,
        type: 'tip',
        title: 'Diversify your investments',
        description: 'Spreading investments across different asset types can help reduce risk and stabilize returns in varying market conditions.',
        severity: 'low',
        timestamp: new Date(),
        actionable: true,
        action: {
          label: 'Learn How'
        }
      });
    }
    
    // Tip: Retirement planning
    let hasRetirementAccount = false;
    assets.forEach(asset => {
      const type = (asset.type || '').toLowerCase();
      if (type.includes('retirement') || type.includes('401k') || type.includes('ira')) {
        hasRetirementAccount = true;
      }
    });
    
    if (!hasRetirementAccount && assets.length > 0) {
      tips.push({
        id: `tip-retirement-${Date.now()}`,
        type: 'tip',
        title: 'Start retirement planning',
        description: 'Consider opening a retirement account to take advantage of tax benefits and compound growth over time.',
        severity: 'medium',
        timestamp: new Date(),
        actionable: true,
        action: {
          label: 'Retirement Options'
        }
      });
    }
    
    // Tip: Income diversification
    if (expenses.length > 0) {
      tips.push({
        id: `tip-income-${Date.now()}`,
        type: 'tip',
        title: 'Consider multiple income streams',
        description: 'Building additional income sources can provide financial stability and accelerate your path to financial goals.',
        severity: 'low',
        timestamp: new Date(),
        actionable: true,
        action: {
          label: 'Income Ideas'
        }
      });
    }
    
    // Tip: Tax optimization
    if (assets.length > 0 || liabilities.length > 0) {
      tips.push({
        id: `tip-tax-${Date.now()}`,
        type: 'tip',
        title: 'Optimize your tax strategy',
        description: 'Review potential tax deductions and credits related to your assets, investments, and liabilities to minimize tax burden.',
        severity: 'medium',
        timestamp: new Date(),
        actionable: true,
        action: {
          label: 'Tax Guide'
        }
      });
    }
    
    return tips;
  }
}

// Export a singleton instance
export const financeAssistant = new FinanceAssistant();