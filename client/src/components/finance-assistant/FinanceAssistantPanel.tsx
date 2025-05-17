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

export function FinanceAssistantPanel() {
  const [insights, setInsights] = useState<FinanceInsight[]>([]);
  const [healthScore, setHealthScore] = useState(0);
  const [activeTab, setActiveTab] = useState("insights");
  const [isLoading, setIsLoading] = useState(true);
  const [personalizedTips, setPersonalizedTips] = useState<FinanceInsight[]>([]);
  
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
  
  // Generate insights when data changes
  useEffect(() => {
    if (isLoadingAssets || isLoadingLiabilities || isLoadingBudget || isLoadingDailyExpenses || isLoadingIncome) {
      setIsLoading(true);
      return;
    }
    
    // Use a small timeout to allow the AI to process the data
    // This simulates the time it would take to process with TensorFlow.js or similar
    const timer = setTimeout(() => {
      try {
        // Use the data from API or fallback to empty arrays if not available (for offline support)
        const assets = assetsData || [];
        const liabilities = liabilitiesData || [];
        const expenses = budgetData || [];
        const dailyExpenses = dailyExpensesData || [];
        const incomes = incomeData || [];
        
        // Save data for offline use
        localStorage.setItem('finvault_cached_assets', JSON.stringify(assets));
        localStorage.setItem('finvault_cached_liabilities', JSON.stringify(liabilities));
        localStorage.setItem('finvault_cached_expenses', JSON.stringify(expenses));
        localStorage.setItem('finvault_cached_daily_expenses', JSON.stringify(dailyExpenses));
        localStorage.setItem('finvault_cached_income', JSON.stringify(incomes));
        
        // Calculate financial summary
        const totalAssets = assets.reduce((sum: number, asset: any) => 
          sum + (parseFloat(asset.value) || 0), 0);
          
        const totalLiabilities = liabilities.reduce((sum: number, liability: any) => 
          sum + (parseFloat(liability.amount) || 0), 0);
          
        const totalIncome = incomes.reduce((sum: number, income: any) => 
          sum + (parseFloat(income.amount) || 0), 0);
        
        // Get insights from our AI assistant
        const newInsights = financeAssistant.getAllInsights(dailyExpenses, expenses);
        setInsights(newInsights);
        
        // Calculate financial health score
        const score = financeAssistant.calculateFinancialHealthScore(
          dailyExpenses,
          expenses,
          totalIncome,
          totalAssets,
          totalLiabilities
        );
        setHealthScore(score);
        
        // Generate personalized tips
        const tips = financeAssistant.getPersonalizedTips(
          dailyExpenses,
          assets,
          liabilities
        );
        setPersonalizedTips(tips);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error processing financial data:", error);
        
        // Try to use cached data for offline functionality
        try {
          const cachedAssets = JSON.parse(localStorage.getItem('finvault_cached_assets') || '[]');
          const cachedLiabilities = JSON.parse(localStorage.getItem('finvault_cached_liabilities') || '[]');
          const cachedExpenses = JSON.parse(localStorage.getItem('finvault_cached_expenses') || '[]');
          const cachedDailyExpenses = JSON.parse(localStorage.getItem('finvault_cached_daily_expenses') || '[]');
          const cachedIncome = JSON.parse(localStorage.getItem('finvault_cached_income') || '[]');
          
          // Calculate financial summary from cached data
          const totalAssets = cachedAssets.reduce((sum: number, asset: any) => 
            sum + (parseFloat(asset.value) || 0), 0);
            
          const totalLiabilities = cachedLiabilities.reduce((sum: number, liability: any) => 
            sum + (parseFloat(liability.amount) || 0), 0);
            
          const totalIncome = cachedIncome.reduce((sum: number, income: any) => 
            sum + (parseFloat(income.amount) || 0), 0);
          
          // Process cached data with the AI assistant
          const newInsights = financeAssistant.getAllInsights(cachedDailyExpenses, cachedExpenses);
          setInsights(newInsights);
          
          const score = financeAssistant.calculateFinancialHealthScore(
            cachedDailyExpenses,
            cachedExpenses,
            totalIncome,
            totalAssets,
            totalLiabilities
          );
          setHealthScore(score);
          
          const tips = financeAssistant.getPersonalizedTips(
            cachedDailyExpenses,
            cachedAssets,
            cachedLiabilities
          );
          setPersonalizedTips(tips);
          
          setIsLoading(false);
        } catch (cacheError) {
          console.error("Error retrieving cached data:", cacheError);
          setIsLoading(false);
        }
      }
    }, 1500);
    
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
  
  // Determine health score status and color
  const getHealthScoreStatus = () => {
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
                      <span className="text-sm">{expenses.filter(e => e.percentage <= 100).length}/{expenses.length} on track</span>
                    </div>
                    <Progress value={expenses.length ? 
                      (expenses.filter(e => e.percentage <= 100).length / expenses.length) * 100 : 
                      0} 
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Debt-to-Asset Ratio</span>
                      <span className="text-sm">
                        {getTotalAssets() ? 
                          Math.round((getTotalLiabilities() / getTotalAssets()) * 100) : 
                          0}%
                      </span>
                    </div>
                    <Progress 
                      value={getTotalAssets() ? 
                        Math.min(100, (getTotalLiabilities() / getTotalAssets()) * 100) : 
                        0}
                      className="[&>div]:bg-orange-500" 
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Savings Rate</span>
                      <span className="text-sm">
                        {getTotalIncome() ? 
                          Math.round(((getTotalIncome() - expenses.reduce((sum, e) => sum + parseFloat(e.spent), 0)) / 
                            getTotalIncome()) * 100) : 
                          0}%
                      </span>
                    </div>
                    <Progress 
                      value={getTotalIncome() ? 
                        Math.max(0, ((getTotalIncome() - expenses.reduce((sum, e) => sum + parseFloat(e.spent), 0)) / 
                          getTotalIncome()) * 100) : 
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