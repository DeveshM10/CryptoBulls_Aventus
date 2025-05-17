/**
 * Edge AI Demo Page
 * 
 * This page demonstrates the complete Edge AI functionality,
 * with voice input processing and real-time data updates.
 */

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  getAssets, 
  getLiabilities, 
  getExpenses, 
  getIncome, 
  subscribe, 
  getFinancialSummary 
} from '../../lib/edge-ai/data-store';
import { EVENTS } from '../../lib/edge-ai/constants';
import { EdgeVoiceInput } from '../../components/edge-ai/EdgeVoiceInput';
import { useEdgeAI } from '../../components/edge-ai/EdgeAIProvider';
import { Sidebar } from '../../components/layout/sidebar';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Mic, 
  Database, 
  BarChart, 
  Wifi, 
  WifiOff,
  RefreshCw,
  Plus,
  DollarSign,
  CreditCard,
  PieChart,
  TrendingUp
} from 'lucide-react';
import { Asset, Liability, Expense, Income } from '../../types/finance';

export default function EdgeAIDemoPage() {
  const [activeTab, setActiveTab] = useState('assets');
  const { isInitialized, isOffline } = useEdgeAI();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [liabilities, setLiabilities] = useState<Liability[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [income, setIncome] = useState<Income[]>([]);
  const [summary, setSummary] = useState({
    totalAssets: 0,
    totalLiabilities: 0,
    netWorth: 0,
    totalIncome: 0,
    totalExpenses: 0,
    cashFlow: 0
  });
  
  // Load initial data
  useEffect(() => {
    if (isInitialized) {
      // Load data from local store
      setAssets(getAssets());
      setLiabilities(getLiabilities());
      setExpenses(getExpenses());
      setIncome(getIncome());
      setSummary(getFinancialSummary());
    }
  }, [isInitialized]);
  
  // Subscribe to data updates
  useEffect(() => {
    if (!isInitialized) return;
    
    // Create event subscriptions for real-time updates
    const unsubscribeAssets = subscribe(EVENTS.ASSET_ADDED, () => {
      setAssets(getAssets());
      setSummary(getFinancialSummary());
    });
    
    const unsubscribeLiabilities = subscribe(EVENTS.LIABILITY_ADDED, () => {
      setLiabilities(getLiabilities());
      setSummary(getFinancialSummary());
    });
    
    const unsubscribeExpenses = subscribe(EVENTS.EXPENSE_ADDED, () => {
      setExpenses(getExpenses());
      setSummary(getFinancialSummary());
    });
    
    const unsubscribeIncome = subscribe(EVENTS.INCOME_ADDED, () => {
      setIncome(getIncome());
      setSummary(getFinancialSummary());
    });
    
    // Global data update subscription
    const unsubscribeData = subscribe(EVENTS.DATA_UPDATED, () => {
      setAssets(getAssets());
      setLiabilities(getLiabilities());
      setExpenses(getExpenses());
      setIncome(getIncome());
      setSummary(getFinancialSummary());
    });
    
    // Cleanup subscriptions on unmount
    return () => {
      unsubscribeAssets();
      unsubscribeLiabilities();
      unsubscribeExpenses();
      unsubscribeIncome();
      unsubscribeData();
    };
  }, [isInitialized]);
  
  // Refresh data manually
  const handleRefresh = () => {
    setAssets(getAssets());
    setLiabilities(getLiabilities());
    setExpenses(getExpenses());
    setIncome(getIncome());
    setSummary(getFinancialSummary());
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 0 
    }).format(amount);
  };
  
  return (
    <div className="flex min-h-screen">
      <Helmet>
        <title>Edge AI Finance | FinVault</title>
      </Helmet>
      
      <Sidebar />
      
      <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-6 ml-0 md:ml-64 lg:ml-72">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Edge AI Finance</h1>
              <p className="text-muted-foreground">
                Manage your finances completely offline with Edge AI technology
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 gap-1" 
                onClick={handleRefresh}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Refresh</span>
              </Button>
              
              <span className="flex items-center gap-1 text-sm">
                {isOffline ? (
                  <>
                    <WifiOff className="h-3.5 w-3.5 text-yellow-500" />
                    <span className="text-yellow-600">Offline</span>
                  </>
                ) : (
                  <>
                    <Wifi className="h-3.5 w-3.5 text-green-500" />
                    <span className="text-green-600">Online</span>
                  </>
                )}
              </span>
            </div>
          </div>
          
          {/* Summary Cards */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(summary.totalAssets)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {assets.length} Assets
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Liabilities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(summary.totalLiabilities)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {liabilities.length} Liabilities
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${summary.netWorth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(summary.netWorth)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {summary.netWorth >= 0 ? 'Positive' : 'Negative'} Balance
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Monthly Cash Flow</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${summary.cashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(summary.cashFlow)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Income - Expenses
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <Card className="mt-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Financial Data Management</CardTitle>
                <div className="flex gap-2">
                  {activeTab === 'assets' && <EdgeVoiceInput type="asset" onSuccess={handleRefresh} />}
                  {activeTab === 'liabilities' && <EdgeVoiceInput type="liability" onSuccess={handleRefresh} />}
                  {activeTab === 'expenses' && <EdgeVoiceInput type="expense" onSuccess={handleRefresh} />}
                  {activeTab === 'income' && <EdgeVoiceInput type="income" onSuccess={handleRefresh} />}
                </div>
              </div>
              <CardDescription>
                All data is processed and stored locally on your device using Edge AI
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="assets" className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    <span>Assets</span>
                  </TabsTrigger>
                  <TabsTrigger value="liabilities" className="flex items-center gap-1">
                    <CreditCard className="h-4 w-4" />
                    <span>Liabilities</span>
                  </TabsTrigger>
                  <TabsTrigger value="expenses" className="flex items-center gap-1">
                    <PieChart className="h-4 w-4" />
                    <span>Expenses</span>
                  </TabsTrigger>
                  <TabsTrigger value="income" className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    <span>Income</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="assets">
                  <div className="rounded-md border">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="p-2 text-left font-medium">Title</th>
                          <th className="p-2 text-left font-medium">Type</th>
                          <th className="p-2 text-left font-medium">Value</th>
                          <th className="p-2 text-left font-medium">Change</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assets.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="p-4 text-center text-muted-foreground">
                              No assets yet. Add one using the Voice Input button.
                            </td>
                          </tr>
                        ) : (
                          assets.map((asset) => (
                            <tr key={asset.id} className="border-b">
                              <td className="p-2">{asset.title}</td>
                              <td className="p-2 capitalize">{asset.type}</td>
                              <td className="p-2">{asset.value}</td>
                              <td className="p-2">
                                <span className={`inline-flex items-center gap-1 ${asset.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                  {asset.change}
                                  {asset.trend === 'up' ? '↑' : '↓'}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                
                <TabsContent value="liabilities">
                  <div className="rounded-md border">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="p-2 text-left font-medium">Title</th>
                          <th className="p-2 text-left font-medium">Type</th>
                          <th className="p-2 text-left font-medium">Amount</th>
                          <th className="p-2 text-left font-medium">Interest</th>
                          <th className="p-2 text-left font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {liabilities.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-4 text-center text-muted-foreground">
                              No liabilities yet. Add one using the Voice Input button.
                            </td>
                          </tr>
                        ) : (
                          liabilities.map((liability) => (
                            <tr key={liability.id} className="border-b">
                              <td className="p-2">{liability.title}</td>
                              <td className="p-2 capitalize">{liability.type}</td>
                              <td className="p-2">{liability.amount}</td>
                              <td className="p-2">{liability.interest}</td>
                              <td className="p-2">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                                  liability.status === 'current' ? 'bg-green-100 text-green-800' :
                                  liability.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {liability.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                
                <TabsContent value="expenses">
                  <div className="rounded-md border">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="p-2 text-left font-medium">Title</th>
                          <th className="p-2 text-left font-medium">Budgeted</th>
                          <th className="p-2 text-left font-medium">Spent</th>
                          <th className="p-2 text-left font-medium">Progress</th>
                        </tr>
                      </thead>
                      <tbody>
                        {expenses.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="p-4 text-center text-muted-foreground">
                              No expenses yet. Add one using the Voice Input button.
                            </td>
                          </tr>
                        ) : (
                          expenses.map((expense) => (
                            <tr key={expense.id} className="border-b">
                              <td className="p-2">{expense.title}</td>
                              <td className="p-2">{expense.budgeted}</td>
                              <td className="p-2">{expense.spent}</td>
                              <td className="p-2 w-32">
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                  <div 
                                    className={`h-2.5 rounded-full ${
                                      expense.status === 'normal' ? 'bg-primary' :
                                      expense.status === 'warning' ? 'bg-yellow-500' :
                                      'bg-red-500'
                                    }`}
                                    style={{ width: `${Math.min(expense.percentage, 100)}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs text-muted-foreground mt-1">
                                  {expense.percentage}%
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                
                <TabsContent value="income">
                  <div className="rounded-md border">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="p-2 text-left font-medium">Title</th>
                          <th className="p-2 text-left font-medium">Amount</th>
                          <th className="p-2 text-left font-medium">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {income.length === 0 ? (
                          <tr>
                            <td colSpan={3} className="p-4 text-center text-muted-foreground">
                              No income yet. Add one using the Voice Input button.
                            </td>
                          </tr>
                        ) : (
                          income.map((item) => (
                            <tr key={item.id} className="border-b">
                              <td className="p-2">{item.title}</td>
                              <td className="p-2">{item.amount}</td>
                              <td className="p-2">{item.description}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            
            <CardFooter className="bg-muted/50 text-sm text-muted-foreground">
              <div className="flex gap-2 items-center">
                <Database className="h-4 w-4" />
                <span>
                  All data is securely stored in your browser's IndexedDB database
                </span>
              </div>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>How the Edge AI System Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-none bg-primary/10 p-2 rounded-md">
                    <Mic className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Voice Recognition & Processing</h3>
                    <p className="text-sm text-muted-foreground">
                      Your voice input is recognized and processed entirely on your device. 
                      No audio data ever leaves your browser.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex-none bg-primary/10 p-2 rounded-md">
                    <BarChart className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Local NLP Analysis</h3>
                    <p className="text-sm text-muted-foreground">
                      Natural language processing extracts financial information from your speech, 
                      such as amounts, categories, and dates.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex-none bg-primary/10 p-2 rounded-md">
                    <Database className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Real-time Local Storage</h3>
                    <p className="text-sm text-muted-foreground">
                      All data is instantly stored in your browser's IndexedDB database 
                      and becomes immediately available in the UI without server round-trips.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}