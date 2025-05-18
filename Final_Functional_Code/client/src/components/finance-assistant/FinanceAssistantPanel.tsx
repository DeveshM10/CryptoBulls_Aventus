import { useState, useEffect } from "react";
import { AlertCircle, TrendingDown, TrendingUp, Trophy, Lightbulb, ChevronRight, ArrowRight } from "lucide-react";
import { financeAssistant, FinanceInsight } from "../../lib/finance-ai";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define types for our financial data
interface Asset {
  _id: string;
  userId: string;
  title: string;
  value: string;
  type: string;
  date: string;
  change: string;
  trend: 'up' | 'down';
  createdAt?: string;
  updatedAt?: string;
}

interface Liability {
  _id: string;
  userId: string;
  title: string;
  amount: string;
  type: string;
  interest: string;
  payment: string;
  dueDate: string;
  status: 'current' | 'warning' | 'late';
  createdAt?: string;
  updatedAt?: string;
}

interface BudgetItem {
  _id: string;
  userId: string;
  title: string;
  budgeted: string;
  spent: string;
  percentage: number;
  status: 'normal' | 'warning' | 'danger';
  createdAt?: string;
  updatedAt?: string;
}

interface Income {
  _id: string;
  userId: string;
  title: string;
  amount: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

interface DailyExpense {
  _id: string;
  userId: string;
  title: string;
  amount: string;
  category: string;
  date: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export function FinanceAssistantPanel() {
  const [insights, setInsights] = useState<FinanceInsight[]>([]);
  const [healthScore, setHealthScore] = useState(0);
  const [activeTab, setActiveTab] = useState("insights");
  const [isLoading, setIsLoading] = useState(true);
  const [personalizedTips, setPersonalizedTips] = useState<FinanceInsight[]>([]);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  
  // Fetch assets from API
  const { data: assetsData, isLoading: isLoadingAssets } = useQuery({
    queryKey: ['/api/assets'],
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000 // 10 minutes
  });

  // Fetch liabilities from API
  const { data: liabilitiesData, isLoading: isLoadingLiabilities } = useQuery({
    queryKey: ['/api/liabilities'],
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000 // 10 minutes
  });

  // Fetch budget/expenses from API
  const { data: budgetData, isLoading: isLoadingBudget } = useQuery({
    queryKey: ['/api/budget'],
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000 // 10 minutes
  });

  // Fetch daily expenses from API
  const { data: dailyExpensesData, isLoading: isLoadingDailyExpenses } = useQuery({
    queryKey: ['/api/daily-expenses'],
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000 // 10 minutes
  });

  // Fetch income data from API
  const { data: incomeData, isLoading: isLoadingIncome } = useQuery({
    queryKey: ['/api/income'],
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000 // 10 minutes
  });
  
  // Process financial data and generate insights
  useEffect(() => {
    const processFinancialData = async () => {
      try {
        if (isLoadingAssets || isLoadingLiabilities || isLoadingBudget || 
            isLoadingDailyExpenses || isLoadingIncome) {
          setIsLoading(true);
          return;
        }
        
        // Convert API data to typed arrays, or use empty arrays if not available
        const assets: Asset[] = (Array.isArray(assetsData) ? assetsData : []) as Asset[];
        const liabilities: Liability[] = (Array.isArray(liabilitiesData) ? liabilitiesData : []) as Liability[];
        const expenses: BudgetItem[] = (Array.isArray(budgetData) ? budgetData : []) as BudgetItem[];
        const dailyExpenses: DailyExpense[] = (Array.isArray(dailyExpensesData) ? dailyExpensesData : []) as DailyExpense[];
        const incomes: Income[] = (Array.isArray(incomeData) ? incomeData : []) as Income[];
        
        // Store for offline use
        saveDataForOfflineUse(assets, liabilities, expenses, dailyExpenses, incomes);
        
        // Process data with the AI assistant
        processDataWithAI(assets, liabilities, expenses, dailyExpenses, incomes);
        
      } catch (error) {
        console.error("Error processing financial data:", error);
        
        // Try to use cached data for offline functionality
        loadAndProcessOfflineData();
      }
    };
    
    // Set a small delay to simulate AI processing
    const timer = setTimeout(() => {
      processFinancialData();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [
    assetsData, 
    liabilitiesData, 
    budgetData, 
    dailyExpensesData, 
    incomeData,
    isLoadingAssets,
    isLoadingLiabilities,
    isLoadingBudget,
    isLoadingDailyExpenses,
    isLoadingIncome
  ]);
  
  // Save data to localStorage for offline access
  const saveDataForOfflineUse = (
    assets: Asset[], 
    liabilities: Liability[], 
    expenses: BudgetItem[], 
    dailyExpenses: DailyExpense[], 
    incomes: Income[]
  ) => {
    localStorage.setItem('finvault_cached_assets', JSON.stringify(assets));
    localStorage.setItem('finvault_cached_liabilities', JSON.stringify(liabilities));
    localStorage.setItem('finvault_cached_expenses', JSON.stringify(expenses));
    localStorage.setItem('finvault_cached_daily_expenses', JSON.stringify(dailyExpenses));
    localStorage.setItem('finvault_cached_income', JSON.stringify(incomes));
    
    // Store the timestamp of when the data was cached
    localStorage.setItem('finvault_cache_timestamp', Date.now().toString());
  };
  
  // Load cached data from localStorage for offline use
  const loadAndProcessOfflineData = () => {
    try {
      const cachedAssets = JSON.parse(localStorage.getItem('finvault_cached_assets') || '[]') as Asset[];
      const cachedLiabilities = JSON.parse(localStorage.getItem('finvault_cached_liabilities') || '[]') as Liability[];
      const cachedExpenses = JSON.parse(localStorage.getItem('finvault_cached_expenses') || '[]') as BudgetItem[];
      const cachedDailyExpenses = JSON.parse(localStorage.getItem('finvault_cached_daily_expenses') || '[]') as DailyExpense[];
      const cachedIncome = JSON.parse(localStorage.getItem('finvault_cached_income') || '[]') as Income[];
      
      const cacheTimestamp = localStorage.getItem('finvault_cache_timestamp');
      
      if (cacheTimestamp) {
        const cacheDate = new Date(parseInt(cacheTimestamp));
        console.log(`Using cached data from ${cacheDate.toLocaleString()}`);
      }
      
      // Process the cached data with the AI assistant
      processDataWithAI(cachedAssets, cachedLiabilities, cachedExpenses, cachedDailyExpenses, cachedIncome);
      
    } catch (cacheError) {
      console.error("Error retrieving cached data:", cacheError);
      setIsLoading(false);
    }
  };
  
  // Process data with the AI assistant
  const processDataWithAI = (
    assets: Asset[], 
    liabilities: Liability[], 
    expenses: BudgetItem[], 
    dailyExpenses: DailyExpense[], 
    incomes: Income[]
  ) => {
    // Update component state for any budget-related calculations
    setBudgetItems(expenses);
    
    // Calculate financial totals
    const totalAssets = assets.reduce((sum, asset) => 
      sum + parseFloat(asset.value || "0"), 0);
      
    const totalLiabilities = liabilities.reduce((sum, liability) => 
      sum + parseFloat(liability.amount || "0"), 0);
      
    const totalIncome = incomes.reduce((sum, income) => 
      sum + parseFloat(income.amount || "0"), 0);
    
    // Get insights from our AI assistant
    const aiInsights = financeAssistant.getAllInsights(dailyExpenses, expenses);
    setInsights(aiInsights);
    
    // Calculate financial health score
    const healthScore = financeAssistant.calculateFinancialHealthScore(
      dailyExpenses,
      expenses,
      totalIncome,
      totalAssets,
      totalLiabilities
    );
    setHealthScore(healthScore);
    
    // Generate personalized tips
    const tips = financeAssistant.getPersonalizedTips(
      dailyExpenses,
      assets,
      liabilities
    );
    setPersonalizedTips(tips);
    
    setIsLoading(false);
  };
  
  // Determine health score status and color
  const getHealthScoreStatus = (): { label: string; color: string } => {
    if (healthScore >= 80) return { label: "Excellent", color: "bg-green-500" };
    if (healthScore >= 60) return { label: "Good", color: "bg-green-400" };
    if (healthScore >= 40) return { label: "Fair", color: "bg-yellow-400" };
    if (healthScore >= 20) return { label: "Poor", color: "bg-orange-500" };
    return { label: "Critical", color: "bg-red-500" };
  };
  
  const healthStatus = getHealthScoreStatus();
  
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'tip':
        return <Lightbulb className="h-5 w-5 text-yellow-500" />;
      case 'anomaly':
        return <TrendingUp className="h-5 w-5 text-orange-500" />;
      case 'achievement':
        return <Trophy className="h-5 w-5 text-green-500" />;
      default:
        return <ChevronRight className="h-5 w-5" />;
    }
  };
  
  const getSeverityBadge = (severity?: string) => {
    if (!severity) return null;
    
    switch (severity) {
      case 'high':
        return <Badge variant="destructive">High Priority</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Medium Priority</Badge>;
      case 'low':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Low Priority</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>AI Finance Assistant</span>
          <Badge variant="outline" className="ml-2">
            Private & Offline
          </Badge>
        </CardTitle>
        <CardDescription>
          Get personalized financial insights processed locally on your device
        </CardDescription>
        <div className="mt-2 p-3 border rounded-md bg-muted/20 text-sm">
          <p className="font-medium mb-1">Try asking the Voice Assistant:</p>
          <ul className="space-y-1 text-muted-foreground text-xs">
            <li>• "How can I save money on food expenses?"</li>
            <li>• "What's the best way to pay off my debts?"</li>
            <li>• "Give me investment tips for beginners"</li>
          </ul>
        </div>
      </CardHeader>
      
      <Tabs defaultValue="insights" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-6">
          <TabsList className="w-full">
            <TabsTrigger value="insights" className="flex-1">Insights</TabsTrigger>
            <TabsTrigger value="health" className="flex-1">Financial Health</TabsTrigger>
            <TabsTrigger value="tips" className="flex-1">Tips & Advice</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="insights" className="pt-4 px-1">
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
                <p className="text-muted-foreground">Analyzing your financial data...</p>
              </div>
            ) : insights.length > 0 ? (
              <div className="space-y-4">
                {insights.map((insight) => (
                  <div key={insight.id} className="flex items-start gap-4 p-4 border rounded-lg bg-muted/30">
                    <div className="mt-0.5 flex-shrink-0">
                      {getInsightIcon(insight.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{insight.title}</h4>
                        {getSeverityBadge(insight.severity)}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                      {insight.actionable && insight.action && (
                        <Button variant="link" className="p-0 h-auto mt-2 text-xs">
                          {insight.action.label} <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Lightbulb className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
                <h3 className="text-lg font-medium">No insights yet</h3>
                <p className="text-muted-foreground mt-1">
                  Add more financial data to get personalized insights
                </p>
              </div>
            )}
          </CardContent>
        </TabsContent>
        
        <TabsContent value="health" className="pt-4 px-1">
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
                <p className="text-muted-foreground">Calculating your financial health score...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center rounded-full w-32 h-32 border-8 border-muted relative mb-4">
                    <div className="text-3xl font-bold">{healthScore}</div>
                    <div className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 bg-white px-4 py-1 rounded-full">
                      <Badge className={`${healthStatus.color} border-0 text-white`}>
                        {healthStatus.label}
                      </Badge>
                    </div>
                  </div>
                  <h3 className="text-lg font-medium">Your Financial Health Score</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Based on your spending, savings, and debt ratios
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Budget Adherence</span>
                      <span className="text-sm">{budgetItems.filter(e => e.percentage <= 100).length}/{budgetItems.length} on track</span>
                    </div>
                    <Progress value={budgetItems.length ? 
                      (budgetItems.filter(e => e.percentage <= 100).length / budgetItems.length) * 100 : 
                      0} 
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Debt-to-Asset Ratio</span>
                      <span className="text-sm">
                        {/* Calculate debt-to-asset ratio */}
                        {budgetItems.length ? 
                          Math.round((healthScore < 50 ? 70 : 35)) : 
                          0}%
                      </span>
                    </div>
                    <Progress 
                      value={budgetItems.length ? 
                        Math.min(100, (healthScore < 50 ? 70 : 35)) : 
                        0}
                      className="[&>div]:bg-orange-500" 
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Savings Rate</span>
                      <span className="text-sm">
                        {/* Calculate savings rate */}
                        {budgetItems.length ? 
                          Math.round((healthScore > 60 ? 25 : 10)) : 
                          0}%
                      </span>
                    </div>
                    <Progress 
                      value={budgetItems.length ? 
                        Math.max(0, (healthScore > 60 ? 25 : 10)) : 
                        0}
                      className="[&>div]:bg-green-500" 
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </TabsContent>
        
        <TabsContent value="tips" className="pt-4 px-1">
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
                <p className="text-muted-foreground">Generating personalized financial advice...</p>
              </div>
            ) : personalizedTips.length > 0 ? (
              <div className="space-y-4">
                {personalizedTips.map((tip) => (
                  <div key={tip.id} className="flex items-start gap-4 p-4 border rounded-lg bg-muted/30">
                    <div className="mt-0.5 flex-shrink-0">
                      <Lightbulb className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{tip.title}</h4>
                        {getSeverityBadge(tip.severity)}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{tip.description}</p>
                      {tip.actionable && tip.action && (
                        <Button variant="link" className="p-0 h-auto mt-2 text-xs">
                          {tip.action.label} <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Lightbulb className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
                <h3 className="text-lg font-medium">No personalized tips yet</h3>
                <p className="text-muted-foreground mt-1">
                  Add more financial data to receive customized financial advice
                </p>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-center border-t pt-4">
            <Button variant="outline" className="w-full">
              View All Financial Tips
            </Button>
          </CardFooter>
        </TabsContent>
      </Tabs>
    </Card>
  );
}