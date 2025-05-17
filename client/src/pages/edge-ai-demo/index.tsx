/**
 * Edge AI Demo Page
 * 
 * This page demonstrates the complete Edge AI functionality,
 * with voice input processing and real-time data updates.
 */

import React, { useState, useEffect, useCallback } from 'react';
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
  CardDescription
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Wifi, 
  WifiOff,
  RefreshCw,
  DollarSign,
  CreditCard,
  PieChart,
  TrendingUp
} from 'lucide-react';
import { Asset, Liability, Expense, Income } from '../../types/finance';

export default function EdgeAIDemoPage() {
  const [activeTab, setActiveTab] = useState('assets');
  const { isInitialized, isOffline, hasPendingSync, triggerSync } = useEdgeAI();
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

  // Refresh data function - unified
  const handleRefresh = useCallback(() => {
    console.log('Refreshing data...');
    
    // Load data from main storage
    const loadedAssets = getAssets();
    const loadedLiabilities = getLiabilities();
    const loadedExpenses = getExpenses();
    const loadedIncome = getIncome();
    
    setAssets(loadedAssets);
    setLiabilities(loadedLiabilities);
    setExpenses(loadedExpenses);
    setIncome(loadedIncome);
    setSummary(getFinancialSummary());
    
    // Check for any local storage items
    try {
      // Check localStorage for any offline saved items
      const checkLocalStorage = (key: string, setter: React.Dispatch<React.SetStateAction<any[]>>, current: any[]) => {
        const localData = window.localStorage.getItem(key);
        if (localData) {
          try {
            const parsedData = JSON.parse(localData);
            if (Array.isArray(parsedData) && parsedData.length > 0) {
              // Merge with loaded data, avoiding duplicates
              const newItems = parsedData.filter(
                newItem => !current.some(existingItem => existingItem.id === newItem.id)
              );
              
              if (newItems.length > 0) {
                console.log(`Found ${newItems.length} new items in localStorage for ${key}`);
                setter(prev => [...prev, ...newItems]);
              }
            }
          } catch (e) {
            console.error(`Error parsing localStorage data for ${key}:`, e);
          }
        }
      };
      
      checkLocalStorage('edgeai_assets', setAssets, loadedAssets);
      checkLocalStorage('edgeai_liabilities', setLiabilities, loadedLiabilities);
      checkLocalStorage('edgeai_expenses', setExpenses, loadedExpenses);
      checkLocalStorage('edgeai_income', setIncome, loadedIncome);
      
    } catch (err) {
      console.error('Error checking localStorage:', err);
    }
  }, []);

  // Load initial data
  useEffect(() => {
    if (isInitialized) {
      handleRefresh();
      
      // Listen for storage events (for cross-tab sync)
      window.addEventListener('storage', handleRefresh);
      
      return () => {
        window.removeEventListener('storage', handleRefresh);
      };
    }
  }, [isInitialized, handleRefresh]);

  // Subscribe to Edge AI data events
  useEffect(() => {
    if (!isInitialized) return;
    
    // Listen for direct summary updates from offline mode
    const handleSummaryUpdate = (e: CustomEvent) => {
      const { type, value } = e.detail;
      
      console.log(`Received summary update: ${type} with value ${value}`);
      
      // Update the financial summary based on the type of data
      setSummary(prev => {
        if (type === 'asset') {
          return {
            ...prev,
            totalAssets: prev.totalAssets + value,
            netWorth: prev.netWorth + value
          };
        } else if (type === 'liability') {
          return {
            ...prev,
            totalLiabilities: prev.totalLiabilities + value,
            netWorth: prev.netWorth - value
          };
        } else if (type === 'expense') {
          return {
            ...prev,
            totalExpenses: prev.totalExpenses + value,
            cashFlow: prev.totalIncome - (prev.totalExpenses + value)
          };
        } else if (type === 'income') {
          return {
            ...prev,
            totalIncome: prev.totalIncome + value,
            cashFlow: (prev.totalIncome + value) - prev.totalExpenses
          };
        }
        return prev;
      });
    };
    
    // Add event listener for direct summary updates
    document.addEventListener('edgeai-summary-update', handleSummaryUpdate as EventListener);
    
    // Handler for real-time updates
    const handleAssetAdded = (asset: Asset) => {
      console.log('Asset added:', asset);
      setAssets(prev => {
        // Check if already exists
        if (prev.some(a => a.id === asset.id)) return prev;
        return [...prev, asset];
      });
      
      // Update summary
      setSummary(prev => {
        const assetValue = parseFloat(asset.value.replace(/[^\d.-]/g, '')) || 0;
        return {
          ...prev,
          totalAssets: prev.totalAssets + assetValue,
          netWorth: prev.netWorth + assetValue
        };
      });
    };
    
    const handleLiabilityAdded = (liability: Liability) => {
      console.log('Liability added:', liability);
      setLiabilities(prev => {
        if (prev.some(l => l.id === liability.id)) return prev;
        return [...prev, liability];
      });
      
      // Update summary
      setSummary(prev => {
        const liabilityAmount = parseFloat(liability.amount.replace(/[^\d.-]/g, '')) || 0;
        return {
          ...prev,
          totalLiabilities: prev.totalLiabilities + liabilityAmount,
          netWorth: prev.netWorth - liabilityAmount
        };
      });
    };
    
    const handleExpenseAdded = (expense: Expense) => {
      console.log('Expense added:', expense);
      setExpenses(prev => {
        if (prev.some(e => e.id === expense.id)) return prev;
        return [...prev, expense];
      });
      
      // Update summary
      setSummary(prev => {
        const expenseSpent = parseFloat(expense.spent.replace(/[^\d.-]/g, '')) || 0;
        return {
          ...prev,
          totalExpenses: prev.totalExpenses + expenseSpent,
          cashFlow: prev.totalIncome - (prev.totalExpenses + expenseSpent)
        };
      });
    };
    
    const handleIncomeAdded = (income: Income) => {
      console.log('Income added:', income);
      setIncome(prev => {
        if (prev.some(i => i.id === income.id)) return prev;
        return [...prev, income];
      });
      
      // Update summary
      setSummary(prev => {
        const incomeAmount = parseFloat(income.amount.replace(/[^\d.-]/g, '')) || 0;
        return {
          ...prev,
          totalIncome: prev.totalIncome + incomeAmount,
          cashFlow: (prev.totalIncome + incomeAmount) - prev.totalExpenses
        };
      });
    };
    
    // Subscribe to data events
    const unsubscribeAssets = subscribe(EVENTS.ASSET_ADDED, handleAssetAdded);
    const unsubscribeLiabilities = subscribe(EVENTS.LIABILITY_ADDED, handleLiabilityAdded);
    const unsubscribeExpenses = subscribe(EVENTS.EXPENSE_ADDED, handleExpenseAdded);
    const unsubscribeIncome = subscribe(EVENTS.INCOME_ADDED, handleIncomeAdded);
    
    // Listen for custom events for direct UI updates
    const handleAssetAddedEvent = (e: CustomEvent) => {
      console.log('Custom event detected: asset added', e.detail);
      handleAssetAdded(e.detail);
    };
    
    const handleLiabilityAddedEvent = (e: CustomEvent) => {
      console.log('Custom event detected: liability added', e.detail);
      handleLiabilityAdded(e.detail);
    };
    
    const handleExpenseAddedEvent = (e: CustomEvent) => {
      console.log('Custom event detected: expense added', e.detail);
      handleExpenseAdded(e.detail);
    };
    
    const handleIncomeAddedEvent = (e: CustomEvent) => {
      console.log('Custom event detected: income added', e.detail);
      handleIncomeAdded(e.detail);
    };
    
    // Add custom event listeners
    document.addEventListener('edgeai-asset-added', handleAssetAddedEvent as EventListener);
    document.addEventListener('edgeai-liability-added', handleLiabilityAddedEvent as EventListener);
    document.addEventListener('edgeai-expense-added', handleExpenseAddedEvent as EventListener);
    document.addEventListener('edgeai-income-added', handleIncomeAddedEvent as EventListener);
    
    // Handle direct refresh requests
    const handleRefreshEvent = () => {
      handleRefresh();
    };
    
    document.addEventListener('edgeai-refresh', handleRefreshEvent);
    
    // Global data update handler
    const handleGlobalDataUpdate = () => {
      handleRefresh();
    };
    
    const unsubscribeGlobal = subscribe(EVENTS.DATA_UPDATED, handleGlobalDataUpdate);
    
    // Cleanup on unmount
    return () => {
      unsubscribeAssets();
      unsubscribeLiabilities();
      unsubscribeExpenses();
      unsubscribeIncome();
      unsubscribeGlobal();
      
      document.removeEventListener('edgeai-asset-added', handleAssetAddedEvent as EventListener);
      document.removeEventListener('edgeai-liability-added', handleLiabilityAddedEvent as EventListener);
      document.removeEventListener('edgeai-expense-added', handleExpenseAddedEvent as EventListener);
      document.removeEventListener('edgeai-income-added', handleIncomeAddedEvent as EventListener);
      document.removeEventListener('edgeai-refresh', handleRefreshEvent);
    };
  }, [isInitialized, handleRefresh]);
  
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
              
              <div className="flex items-center gap-2">
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
                
                {/* Sync button - only shown when online and there's pending data */}
                {!isOffline && hasPendingSync && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 gap-1 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100" 
                    onClick={triggerSync}
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Sync</span>
                  </Button>
                )}
              </div>
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
                {isOffline && (
                  <span className="text-yellow-600 block mt-1">
                    <strong>You're offline.</strong> Your data is being stored locally.
                  </span>
                )}
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
                
                <TabsContent value="assets" className="mt-0">
                  <div className="rounded-md border">
                    <div className="relative w-full overflow-auto">
                      <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Value</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Type</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Change</th>
                          </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                          {assets.length === 0 ? (
                            <tr className="border-b transition-colors hover:bg-muted/50">
                              <td colSpan={5} className="p-4 text-center text-muted-foreground">
                                No assets found. Use the "Add" button to create one.
                              </td>
                            </tr>
                          ) : (
                            assets.map(asset => (
                              <tr key={asset.id} className="border-b transition-colors hover:bg-muted/50">
                                <td className="p-4 align-middle">{asset.title}</td>
                                <td className="p-4 align-middle">{asset.value}</td>
                                <td className="p-4 align-middle">{asset.type}</td>
                                <td className="p-4 align-middle">{asset.date}</td>
                                <td className="p-4 align-middle">
                                  <span className={asset.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                                    {asset.change}
                                  </span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="liabilities" className="mt-0">
                  <div className="rounded-md border">
                    <div className="relative w-full overflow-auto">
                      <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Amount</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Type</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Interest</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Due Date</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                          {liabilities.length === 0 ? (
                            <tr className="border-b transition-colors hover:bg-muted/50">
                              <td colSpan={6} className="p-4 text-center text-muted-foreground">
                                No liabilities found. Use the "Add" button to create one.
                              </td>
                            </tr>
                          ) : (
                            liabilities.map(liability => (
                              <tr key={liability.id} className="border-b transition-colors hover:bg-muted/50">
                                <td className="p-4 align-middle">{liability.title}</td>
                                <td className="p-4 align-middle">{liability.amount}</td>
                                <td className="p-4 align-middle">{liability.type}</td>
                                <td className="p-4 align-middle">{liability.interest}</td>
                                <td className="p-4 align-middle">{liability.dueDate}</td>
                                <td className="p-4 align-middle">
                                  <span className={`px-2 py-1 rounded text-xs ${
                                    liability.status === 'current' 
                                      ? 'bg-green-100 text-green-800' 
                                      : liability.status === 'warning'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-red-100 text-red-800'
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
                  </div>
                </TabsContent>
                
                <TabsContent value="expenses" className="mt-0">
                  <div className="rounded-md border">
                    <div className="relative w-full overflow-auto">
                      <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <th className="h-12 px-4 text-left align-middle font-medium">Category</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Budgeted</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Spent</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Percentage</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                          {expenses.length === 0 ? (
                            <tr className="border-b transition-colors hover:bg-muted/50">
                              <td colSpan={5} className="p-4 text-center text-muted-foreground">
                                No expenses found. Use the "Add" button to create one.
                              </td>
                            </tr>
                          ) : (
                            expenses.map(expense => (
                              <tr key={expense.id} className="border-b transition-colors hover:bg-muted/50">
                                <td className="p-4 align-middle">{expense.title}</td>
                                <td className="p-4 align-middle">{expense.budgeted}</td>
                                <td className="p-4 align-middle">{expense.spent}</td>
                                <td className="p-4 align-middle">
                                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full ${
                                        expense.status === 'normal' 
                                          ? 'bg-blue-500' 
                                          : expense.status === 'warning' 
                                            ? 'bg-yellow-500' 
                                            : 'bg-red-500'
                                      }`}
                                      style={{ width: `${expense.percentage}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-xs text-muted-foreground mt-1">
                                    {expense.percentage}%
                                  </span>
                                </td>
                                <td className="p-4 align-middle">
                                  <span className={`px-2 py-1 rounded text-xs ${
                                    expense.status === 'normal' 
                                      ? 'bg-blue-100 text-blue-800' 
                                      : expense.status === 'warning'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-red-100 text-red-800'
                                  }`}>
                                    {expense.status}
                                  </span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="income" className="mt-0">
                  <div className="rounded-md border">
                    <div className="relative w-full overflow-auto">
                      <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <th className="h-12 px-4 text-left align-middle font-medium">Source</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Amount</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Description</th>
                          </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                          {income.length === 0 ? (
                            <tr className="border-b transition-colors hover:bg-muted/50">
                              <td colSpan={3} className="p-4 text-center text-muted-foreground">
                                No income found. Use the "Add" button to create one.
                              </td>
                            </tr>
                          ) : (
                            income.map(inc => (
                              <tr key={inc.id} className="border-b transition-colors hover:bg-muted/50">
                                <td className="p-4 align-middle">{inc.title}</td>
                                <td className="p-4 align-middle">{inc.amount}</td>
                                <td className="p-4 align-middle">{inc.description}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}