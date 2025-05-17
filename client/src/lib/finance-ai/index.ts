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
    
    // Need minimum amount of data
    if (this.expenses.length < 10) {
      return opportunities;
    }
    
    // Calculate total spending by category for the last month
    const categorySpending: Record<string, number> = {};
    const now = new Date();
    const monthAgo = new Date(now.setDate(now.getDate() - 30));
    
    this.expenses.forEach(expense => {
      const expenseDate = new Date(expense.date);
      if (expenseDate >= monthAgo && config.categories.includes(expense.category)) {
        if (!categorySpending[expense.category]) {
          categorySpending[expense.category] = 0;
        }
        categorySpending[expense.category] += parseFloat(expense.amount);
      }
    });
    
    // Check for saving opportunities
    Object.entries(categorySpending).forEach(([category, totalSpent]) => {
      if (totalSpent >= config.minAmount) {
        const potentialSaving = Math.round(totalSpent * (config.threshold / 100));
        
        if (potentialSaving >= 20) { // Only suggest if savings are meaningful
          opportunities.push({
            id: `saving-${category}-${Date.now()}`,
            type: 'tip',
            title: `Saving opportunity in ${category}`,
            description: `You could save approximately $${potentialSaving} by reducing your ${category} expenses by ${config.threshold}%.`,
            category,
            severity: 'low',
            timestamp: new Date(),
            actionable: true,
            action: {
              label: 'Get Tips'
            }
          });
        }
      }
    });
    
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
    
    // Calculate monthly expenses
    const totalMonthlyExpenses = expenses.reduce(
      (sum, expense) => sum + parseFloat(expense.amount), 0
    ) / 12; // Assuming annual or convert as needed
    
    // Tip 1: Emergency fund
    const liquidAssets = assets
      .filter(a => ['cash', 'savings', 'checking'].includes(a.type.toLowerCase()))
      .reduce((sum, asset) => sum + parseFloat(asset.value), 0);
    
    if (liquidAssets < totalMonthlyExpenses * 3) {
      tips.push({
        id: `tip-emergency-fund-${Date.now()}`,
        type: 'tip',
        title: 'Build an emergency fund',
        description: 'Aim to save 3-6 months of expenses in easily accessible accounts.',
        severity: 'medium',
        timestamp: new Date(),
        actionable: true,
        action: {
          label: 'Learn More'
        }
      });
    }
    
    // Tip 2: High-interest debt
    const highInterestDebt = liabilities
      .filter(l => parseFloat(l.interest) > 10)
      .reduce((sum, liability) => sum + parseFloat(liability.amount), 0);
    
    if (highInterestDebt > 0) {
      tips.push({
        id: `tip-high-interest-debt-${Date.now()}`,
        type: 'tip',
        title: 'Prioritize high-interest debt',
        description: 'Focus on paying down your high-interest debt to save money in the long run.',
        severity: 'high',
        timestamp: new Date(),
        actionable: true,
        action: {
          label: 'Get Strategy'
        }
      });
    }
    
    // Tip 3: Diversification
    const investmentTypes = new Set(
      assets
        .filter(a => ['stocks', 'bonds', 'crypto', 'etf', 'mutual fund'].includes(a.type.toLowerCase()))
        .map(a => a.type.toLowerCase())
    );
    
    if (investmentTypes.size < 3 && assets.length > 0) {
      tips.push({
        id: `tip-diversification-${Date.now()}`,
        type: 'tip',
        title: 'Diversify your investments',
        description: 'Consider spreading your investments across different asset types to reduce risk.',
        severity: 'low',
        timestamp: new Date(),
        actionable: true,
        action: {
          label: 'Learn How'
        }
      });
    }
    
    return tips;
  }
}

// Export a singleton instance
export const financeAssistant = new FinanceAssistant();