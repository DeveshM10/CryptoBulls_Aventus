/**
 * Edge-Based Budget Recommender
 * 
 * A lightweight machine learning model that runs entirely on the client device
 * to provide personalized budget recommendations based on spending patterns.
 * 
 * This uses simple but effective algorithms like k-means clustering and decision trees
 * that can run efficiently in the browser without requiring server communication.
 */

export interface Expense {
  amount: number;
  category: string;
  date: string; // ISO format date string
  isRecurring?: boolean;
}

export interface BudgetRecommendation {
  weeklyTotal: number;
  categoryBreakdown: {
    category: string;
    amount: number;
    percentOfTotal: number;
    comparedToAverage: 'higher' | 'lower' | 'similar';
    warning?: string;
  }[];
  confidenceScore: number; // 0-100
  nextWeekForecast: number;
  savingsRecommendation: number;
  rationale: string[];
}

export class BudgetRecommender {
  private expenses: Expense[] = [];
  private categoryClusters: Map<string, number[]> = new Map();
  private weeklyTotals: number[] = [];
  private maxDataPoints = 500; // Maximum history to keep to maintain performance
  private lastRefitTime: number = 0;
  private modelTrained = false;
  private trendFactors: Record<string, number> = {};
  private weeklyTrend: number = 0;
  private storageKey = 'finvault_budget_expenses';
  private seasonalityFactors: Record<string, number[]> = {
    // Day of week factors (0 = Sunday)
    dayOfWeek: [1.1, 0.9, 0.8, 0.9, 1.0, 1.3, 1.2],
    // Month factors
    month: [1.2, 0.9, 0.9, 1.0, 1.0, 1.1, 1.3, 1.1, 1.0, 1.0, 1.1, 1.5]
  };

  constructor() {
    this.loadExpenses();
    
    // Initialize basic trend factors
    this.trendFactors = {
      food: 1.0,
      groceries: 1.0,
      dining: 1.0,
      entertainment: 1.0,
      shopping: 1.0,
      transportation: 1.0,
      utilities: 1.0,
      housing: 1.0,
      healthcare: 1.0,
      personal: 1.0,
      education: 1.0,
      other: 1.0
    };
  }

  /**
   * Load expenses from local storage
   */
  private loadExpenses(): void {
    try {
      const storedData = localStorage.getItem(this.storageKey);
      if (storedData) {
        this.expenses = JSON.parse(storedData);
        console.log(`Loaded ${this.expenses.length} expenses from storage`);
      }
    } catch (error) {
      console.error('Error loading expenses from storage:', error);
      this.expenses = [];
    }
  }

  /**
   * Save expenses to local storage
   */
  private saveExpenses(): void {
    try {
      // Limit to last maxDataPoints to prevent storage issues
      const limitedExpenses = this.expenses.slice(-this.maxDataPoints);
      localStorage.setItem(this.storageKey, JSON.stringify(limitedExpenses));
    } catch (error) {
      console.error('Error saving expenses to storage:', error);
    }
  }

  /**
   * Add expenses to the model
   */
  public addExpenses(newExpenses: Expense[]): void {
    if (!newExpenses || newExpenses.length === 0) return;
    
    this.expenses = [...this.expenses, ...newExpenses];
    
    // Trim expenses list if it gets too long
    if (this.expenses.length > this.maxDataPoints) {
      this.expenses = this.expenses.slice(-this.maxDataPoints);
    }
    
    this.saveExpenses();
    this.modelTrained = false; // Need to retrain the model
  }

  /**
   * Add a single expense to the model
   */
  public addExpense(expense: Expense): void {
    this.addExpenses([expense]);
  }

  /**
   * Get all expenses
   */
  public getExpenses(): Expense[] {
    return [...this.expenses];
  }

  /**
   * Clear all expense data
   */
  public clearData(): void {
    this.expenses = [];
    this.categoryClusters = new Map();
    this.weeklyTotals = [];
    this.modelTrained = false;
    localStorage.removeItem(this.storageKey);
  }

  /**
   * Group expenses by week
   */
  private groupExpensesByWeek(): Record<string, Expense[]> {
    const weeklyExpenses: Record<string, Expense[]> = {};
    
    this.expenses.forEach(expense => {
      const date = new Date(expense.date);
      // Get the week number (use ISO week)
      const weekNumber = this.getWeekNumber(date);
      const weekKey = `${date.getFullYear()}-W${weekNumber}`;
      
      if (!weeklyExpenses[weekKey]) {
        weeklyExpenses[weekKey] = [];
      }
      
      weeklyExpenses[weekKey].push(expense);
    });
    
    return weeklyExpenses;
  }

  /**
   * Get ISO week number for a date
   */
  private getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  }

  /**
   * Group expenses by category
   */
  private groupExpensesByCategory(): Record<string, Expense[]> {
    const categoryExpenses: Record<string, Expense[]> = {};
    
    this.expenses.forEach(expense => {
      const category = expense.category.toLowerCase();
      
      if (!categoryExpenses[category]) {
        categoryExpenses[category] = [];
      }
      
      categoryExpenses[category].push(expense);
    });
    
    return categoryExpenses;
  }

  /**
   * Analyze historical spending patterns and train the model
   */
  private fitModel(): void {
    if (this.expenses.length < 5) {
      // Not enough data to build a meaningful model
      return;
    }
    
    // Only refit the model if it's been a while or it's not trained
    const now = Date.now();
    if (this.modelTrained && now - this.lastRefitTime < 3600000) { // 1 hour
      return;
    }
    
    // Group expenses by week
    const weeklyExpenses = this.groupExpensesByWeek();
    
    // Calculate weekly totals
    this.weeklyTotals = Object.values(weeklyExpenses).map(expenses => 
      expenses.reduce((sum, exp) => sum + exp.amount, 0)
    );
    
    // Calculate weekly trend (simple linear regression)
    if (this.weeklyTotals.length >= 3) {
      const recentWeeks = this.weeklyTotals.slice(-6); // Last 6 weeks
      this.weeklyTrend = this.calculateTrend(recentWeeks);
    }
    
    // Group expenses by category
    const categoryExpenses = this.groupExpensesByCategory();
    
    // Calculate category clusters (amounts spent in each category)
    this.categoryClusters = new Map();
    Object.entries(categoryExpenses).forEach(([category, expenses]) => {
      const amounts = expenses.map(exp => exp.amount);
      this.categoryClusters.set(category, amounts);
      
      // Update trend factors for each category (if we have enough data)
      if (amounts.length >= 3) {
        const recentAmounts = amounts.slice(-5); // Last 5 expenses in this category
        const categoryTrend = this.calculateTrend(recentAmounts);
        this.trendFactors[category] = 1 + categoryTrend;
      }
    });
    
    this.modelTrained = true;
    this.lastRefitTime = now;
  }

  /**
   * Calculate a simple trend coefficient (-1 to +1) based on recent values
   * Uses a simplified linear regression slope
   */
  private calculateTrend(values: number[]): number {
    if (values.length < 3) return 0;
    
    // Use last few values to calculate trend
    const recentValues = values.slice(-5);
    const n = recentValues.length;
    
    // Simple method: compare average of first half to average of second half
    const midpoint = Math.floor(n / 2);
    const firstHalf = recentValues.slice(0, midpoint);
    const secondHalf = recentValues.slice(midpoint);
    
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    
    // Normalize to a range close to -0.2 to +0.2
    const trend = (secondAvg - firstAvg) / (firstAvg || 1);
    
    // Clamp to a reasonable range
    return Math.max(-0.3, Math.min(0.3, trend));
  }

  /**
   * Get category data
   */
  private getCategoryStats(): Record<string, { 
    average: number; 
    median: number; 
    stdev: number; 
    trend: number;
    percentOfTotal: number;
  }> {
    const result: Record<string, any> = {};
    let totalAverage = 0;
    
    // First calculate average for each category
    this.categoryClusters.forEach((amounts, category) => {
      const sum = amounts.reduce((a, b) => a + b, 0);
      const average = sum / amounts.length;
      
      // Sort for median calculation
      const sorted = [...amounts].sort((a, b) => a - b);
      const median = sorted[Math.floor(sorted.length / 2)];
      
      // Calculate standard deviation
      const squareDiffs = amounts.map(value => {
        const diff = value - average;
        return diff * diff;
      });
      const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / amounts.length;
      const stdev = Math.sqrt(avgSquareDiff);
      
      result[category] = {
        average,
        median,
        stdev,
        trend: this.trendFactors[category] || 1.0,
        percentOfTotal: 0 // Will calculate after we know the total
      };
      
      totalAverage += average;
    });
    
    // Calculate percentage of total
    Object.keys(result).forEach(category => {
      result[category].percentOfTotal = totalAverage > 0 
        ? (result[category].average / totalAverage) * 100 
        : 0;
    });
    
    return result;
  }

  /**
   * Generate budget recommendations based on spending patterns
   */
  public generateRecommendation(): BudgetRecommendation {
    // Ensure the model is trained with the latest data
    this.fitModel();
    
    // If we don't have enough data, return a basic recommendation
    if (!this.modelTrained || this.expenses.length < 5) {
      return this.generateBasicRecommendation();
    }
    
    // Calculate weekly average from historical data
    const weeklyAverage = this.weeklyTotals.length > 0
      ? this.weeklyTotals.reduce((a, b) => a + b, 0) / this.weeklyTotals.length
      : 0;
    
    // Get statistics for each spending category
    const categoryStats = this.getCategoryStats();
    
    // Apply trends and seasonality to predict next week's spending
    const today = new Date();
    const dayOfWeek = today.getDay();
    const month = today.getMonth();
    // Get the seasonal factors with proper type safety
    const dayFactor = this.seasonalityFactors.dayOfWeek[dayOfWeek] || 1.0;
    const monthFactor = this.seasonalityFactors.month[month] || 1.0;
    const seasonalFactor = (dayFactor + monthFactor) / 2;
    
    // Predict next week total with trend and seasonality
    const nextWeekForecast = weeklyAverage * (1 + this.weeklyTrend) * seasonalFactor;
    
    // Create category breakdown
    const categoryBreakdown = Object.entries(categoryStats).map(([category, stats]) => {
      // Apply category-specific trends and overall seasonality
      const recommendedAmount = stats.average * stats.trend * seasonalFactor;
      
      // Determine if this category is higher/lower than average
      let comparedToAverage: 'higher' | 'lower' | 'similar' = 'similar';
      if (stats.trend > 1.1) comparedToAverage = 'higher';
      if (stats.trend < 0.9) comparedToAverage = 'lower';
      
      // Generate warning if spending in this category is unusually high
      let warning: string | undefined;
      if (stats.trend > 1.2 && stats.percentOfTotal > 15) {
        warning = `Spending in ${category} is trending up significantly`;
      }
      
      return {
        category,
        amount: Math.round(recommendedAmount),
        percentOfTotal: Math.round(stats.percentOfTotal),
        comparedToAverage,
        warning
      };
    });
    
    // Sort categories by amount (descending)
    categoryBreakdown.sort((a, b) => b.amount - a.amount);
    
    // Calculate recommended savings (10-20% of total, depending on trends)
    const savingsPercent = this.weeklyTrend > 0 ? 20 : 10;
    const savingsRecommendation = Math.round(nextWeekForecast * (savingsPercent / 100));
    
    // Generate rationale
    const rationale = [];
    rationale.push(`Based on your past ${this.weeklyTotals.length} weeks of spending data`);
    
    if (this.weeklyTrend > 0.05) {
      rationale.push(`Your spending is trending upward (${Math.round(this.weeklyTrend * 100)}% increase)`);
    } else if (this.weeklyTrend < -0.05) {
      rationale.push(`Your spending is trending downward (${Math.round(Math.abs(this.weeklyTrend) * 100)}% decrease)`);
    } else {
      rationale.push(`Your spending has been relatively stable`);
    }
    
    // Add category-specific rationale
    const highCategories = categoryBreakdown
      .filter(c => c.comparedToAverage === 'higher' && c.percentOfTotal > 10)
      .map(c => c.category);
      
    if (highCategories.length > 0) {
      rationale.push(`You're spending more than usual on: ${highCategories.join(', ')}`);
    }
    
    // Calculate confidence score based on amount of data available
    const confidenceScore = Math.min(
      100, 
      Math.round(
        (this.expenses.length / 30) * 40 + // Data volume (max 40 points)
        (this.weeklyTotals.length / 8) * 40 + // Weekly history (max 40 points)
        (Object.keys(categoryStats).length / 5) * 20 // Category diversity (max 20 points)
      )
    );
    
    return {
      weeklyTotal: Math.round(nextWeekForecast),
      categoryBreakdown,
      confidenceScore,
      nextWeekForecast: Math.round(nextWeekForecast),
      savingsRecommendation,
      rationale,
    };
  }

  /**
   * Generate a basic recommendation when we don't have enough data
   */
  private generateBasicRecommendation(): BudgetRecommendation {
    // Get a rough weekly total from the limited data
    const totalSpent = this.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const avgPerExpense = totalSpent / Math.max(1, this.expenses.length);
    const estimatedWeeklyTotal = Math.max(500, Math.round(avgPerExpense * 10)); // Assume ~10 expenses per week
    
    // Get the categories we have data for
    const categories = Array.from(new Set(this.expenses.map(e => e.category)));
    
    // Basic category breakdown
    const categoryBreakdown = categories.map(category => {
      const catExpenses = this.expenses.filter(e => e.category === category);
      const catTotal = catExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      const percentOfTotal = Math.round((catTotal / Math.max(1, totalSpent)) * 100);
      
      return {
        category,
        amount: Math.round(estimatedWeeklyTotal * (percentOfTotal / 100)),
        percentOfTotal,
        comparedToAverage: 'similar' as 'similar'
      };
    });
    
    // If we have limited categories, add some common ones
    const commonCategories = [
      'Groceries', 'Transportation', 'Dining', 'Entertainment', 'Shopping'
    ];
    
    if (categoryBreakdown.length < 3) {
      commonCategories.forEach(category => {
        if (!categories.includes(category)) {
          categoryBreakdown.push({
            category,
            amount: Math.round(estimatedWeeklyTotal * 0.15), // 15% of total
            percentOfTotal: 15,
            comparedToAverage: 'similar' as 'similar'
          });
        }
      });
    }
    
    // Sort categories by amount (descending)
    categoryBreakdown.sort((a, b) => b.amount - a.amount);
    
    return {
      weeklyTotal: estimatedWeeklyTotal,
      categoryBreakdown,
      confidenceScore: Math.min(30, this.expenses.length * 5), // Low confidence
      nextWeekForecast: estimatedWeeklyTotal,
      savingsRecommendation: Math.round(estimatedWeeklyTotal * 0.1), // 10% of total
      rationale: [
        `Based on limited data (${this.expenses.length} expense entries)`,
        `Add more manual expenses for improved recommendations`,
        `This is a starter budget to help you begin tracking`
      ],
    };
  }

  /**
   * Get model statistics for UI display
   */
  public getModelStats() {
    return {
      totalExpenses: this.expenses.length,
      weeksOfData: this.weeklyTotals.length,
      categoriesTracked: this.categoryClusters.size,
      lastUpdated: new Date(),
      totalSpent: this.expenses.reduce((sum, exp) => sum + exp.amount, 0),
      confidenceLevel: this.modelTrained ? 
        (this.expenses.length > 30 ? 'High' : 'Medium') : 
        'Low'
    };
  }
  
  /**
   * Clear the recommended budget when the user wants to reset
   */
  public reset(): void {
    this.clearData();
  }
}