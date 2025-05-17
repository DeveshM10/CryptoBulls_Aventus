import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { MainLayout } from "@/components/layout/main-layout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Calculator, 
  RefreshCw, 
  Plus, 
  DownloadCloud, 
  FileText,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ManualEntryForm from "@/components/budget-recommender/ManualEntryForm";
import BudgetRecommendationCard from "@/components/budget-recommender/BudgetRecommendationCard";
import { BudgetRecommender, Expense, BudgetRecommendation } from "@/services/ml/BudgetRecommender";

export default function BudgetRecommenderPage() {
  const [activeTab, setActiveTab] = useState("budget");
  const [budgetRecommender] = useState(() => new BudgetRecommender());
  const [recommendation, setRecommendation] = useState<BudgetRecommendation | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modelStats, setModelStats] = useState({
    totalExpenses: 0,
    weeksOfData: 0,
    categoriesTracked: 0,
    lastUpdated: new Date(),
    confidenceLevel: 'Low' as 'Low' | 'Medium' | 'High'
  });
  const { toast } = useToast();

  // Load data on component mount
  useEffect(() => {
    loadExpenses();
    generateRecommendation();
  }, []);

  // Load expenses from the budget recommender
  const loadExpenses = () => {
    const loadedExpenses = budgetRecommender.getExpenses();
    setExpenses(loadedExpenses);
    
    // Update model stats
    const stats = budgetRecommender.getModelStats();
    setModelStats({
      totalExpenses: stats.totalExpenses,
      weeksOfData: stats.weeksOfData,
      categoriesTracked: stats.categoriesTracked,
      lastUpdated: stats.lastUpdated,
      confidenceLevel: stats.confidenceLevel as 'Low' | 'Medium' | 'High'
    });
  };

  // Generate budget recommendation
  const generateRecommendation = () => {
    setIsLoading(true);
    
    // Short timeout to allow UI to update
    setTimeout(() => {
      try {
        const newRecommendation = budgetRecommender.generateRecommendation();
        setRecommendation(newRecommendation);
        
        // Update stats after generating recommendation
        const stats = budgetRecommender.getModelStats();
        setModelStats({
          totalExpenses: stats.totalExpenses,
          weeksOfData: stats.weeksOfData,
          categoriesTracked: stats.categoriesTracked,
          lastUpdated: stats.lastUpdated,
          confidenceLevel: stats.confidenceLevel as 'Low' | 'Medium' | 'High'
        });
      } catch (error) {
        console.error('Error generating recommendation:', error);
        toast({
          title: "Error",
          description: "Failed to generate budget recommendation.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  // Handle adding a new expense
  const handleAddExpense = (expense: Expense) => {
    budgetRecommender.addExpense(expense);
    loadExpenses();
    generateRecommendation();
    
    toast({
      title: "Expense added",
      description: "Your budget recommendation has been updated.",
    });
  };

  // Handle resetting all data
  const handleResetData = () => {
    if (window.confirm("Are you sure you want to delete all expense data? This cannot be undone.")) {
      budgetRecommender.clearData();
      loadExpenses();
      setRecommendation(null);
      
      toast({
        title: "Data reset",
        description: "All expense data has been cleared.",
      });
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <MainLayout>
      <Helmet>
        <title>Budget Recommender | FinVault</title>
      </Helmet>
      
      <div className="container py-6 max-w-6xl mx-auto">
        <div className="flex flex-col space-y-2 md:flex-row md:justify-between md:items-center md:space-y-0 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edge Budget Recommender</h1>
            <p className="text-muted-foreground">
              Get personalized budget recommendations based on your cash spending
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={generateRecommendation}
              disabled={isLoading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleResetData}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Reset Data
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="budget">
              <Calculator className="mr-2 h-4 w-4" />
              Budget Recommendation
            </TabsTrigger>
            <TabsTrigger value="expenses">
              <BarChart className="mr-2 h-4 w-4" />
              My Expenses
            </TabsTrigger>
          </TabsList>
          
          <div className="grid gap-6 md:grid-cols-12 mt-6">
            <TabsContent value="budget" className="md:col-span-12 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <BudgetRecommendationCard
                  recommendation={recommendation}
                  isLoading={isLoading}
                  onRefresh={generateRecommendation}
                  modelStats={modelStats}
                />
                
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Add Expense</CardTitle>
                      <CardDescription>
                        Track your cash spending to improve recommendations
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ManualEntryForm onExpenseAdded={handleAddExpense} />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>About This Feature</CardTitle>
                      <CardDescription>
                        How the offline budget recommender works
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-sm space-y-2">
                        <p>
                          The Edge Budget Recommender uses machine learning to analyze your 
                          spending patterns and provide personalized budget recommendations, 
                          all while running completely on your device.
                        </p>
                        <p>
                          Your data never leaves your device, providing better privacy 
                          and allowing the app to work offline.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Key Features:</h4>
                        <ul className="text-sm space-y-1 list-disc pl-4 text-muted-foreground">
                          <li>Works 100% offline - no internet needed</li>
                          <li>Voice input for quick expense tracking</li>
                          <li>Learns from your spending patterns</li>
                          <li>Provides category-specific recommendations</li>
                          <li>Stores data locally in your browser</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="expenses" className="md:col-span-12">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-1">
                  <ManualEntryForm onExpenseAdded={handleAddExpense} />
                </div>
                
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Expense History</CardTitle>
                      <CardDescription>
                        Your tracked cash expenses
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {expenses.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 space-y-4">
                          <FileText className="h-10 w-10 text-muted-foreground" />
                          <p className="text-center text-muted-foreground">
                            No expenses recorded yet. Start adding your cash expenses.
                          </p>
                        </div>
                      ) : (
                        <div className="rounded-md border">
                          <div className="overflow-auto max-h-[400px]">
                            <table className="w-full">
                              <thead>
                                <tr className="border-b bg-muted/40 text-sm">
                                  <th className="text-left font-medium p-2">Date</th>
                                  <th className="text-left font-medium p-2">Category</th>
                                  <th className="text-right font-medium p-2">Amount</th>
                                </tr>
                              </thead>
                              <tbody>
                                {[...expenses].reverse().map((expense, index) => (
                                  <tr 
                                    key={index} 
                                    className="border-b hover:bg-muted/30 transition-colors"
                                  >
                                    <td className="p-2 text-sm">{formatDate(expense.date)}</td>
                                    <td className="p-2 text-sm">
                                      <span className="inline-flex items-center">
                                        {expense.category}
                                        {expense.isRecurring && (
                                          <span className="ml-2 px-1 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-sm">
                                            Recurring
                                          </span>
                                        )}
                                      </span>
                                    </td>
                                    <td className="p-2 text-sm text-right">{formatCurrency(expense.amount)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </MainLayout>
  );
}