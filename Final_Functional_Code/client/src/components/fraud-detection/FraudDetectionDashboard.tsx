import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fraudDetectionService } from "@/services/FraudDetection";

import {
  AlertTriangle,
  Shield,
  CheckCircle,
  XCircle,
  Info,
  Activity,
  MapPin,
  Clock,
  User,
  DollarSign,
  Search,
  Filter,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  _id: string;
  amount: number;
  description: string;
  category: string;
  timestamp: string;
  location: {
    latitude: number;
    longitude: number;
  };
  deviceId: string;
  merchantName: string;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'failed' | 'flagged';
  fraudScore: number;
  flaggedBy: 'system' | 'user' | null;
  fraudFeatures: {
    amountDeviation: number;
    locationAnomaly: number;
    timeAnomaly: number;
    merchantAnomaly: number;
    frequencyAnomaly: number;
  };
}

interface TransactionStats {
  totalCount: number;
  flaggedCount: number;
  totalAmount: number;
  categories: { category: string; count: number }[];
  topMerchant: string;
}

export function FraudDetectionDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'all' | 'flagged'>('all');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLocalDetectionEnabled, setIsLocalDetectionEnabled] = useState(true);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch transactions
  const { data: transactions = [], isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['/api/transactions'],
    queryFn: async () => {
      const response = await fetch('/api/transactions');
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      return response.json();
    }
  });

  // Fetch transaction stats
  const { data: transactionStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['/api/transactions/stats/summary'],
    queryFn: async () => {
      const response = await fetch('/api/transactions/stats/summary');
      if (!response.ok) {
        throw new Error('Failed to fetch transaction stats');
      }
      return response.json() as Promise<TransactionStats>;
    }
  });

  // Mutation to update transaction status
  const updateTransactionStatus = useMutation({
    mutationFn: async ({ id, status, flaggedBy }: { id: string; status: string; flaggedBy: string | null }) => {
      const response = await fetch(`/api/transactions/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, flaggedBy }),
      });

      if (!response.ok) {
        throw new Error('Failed to update transaction status');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/transactions/stats/summary'] });
      setIsDialogOpen(false);
      toast({
        title: "Status updated",
        description: "Transaction status has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error('Error updating transaction:', error);
      toast({
        title: "Error",
        description: "Failed to update transaction status.",
        variant: "destructive",
      });
    },
  });

  // Filter transactions based on search term and view mode
  const filteredTransactions = transactions.filter((transaction: Transaction) => {
    const matchesSearch = 
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.merchantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (viewMode === 'flagged') {
      return matchesSearch && transaction.status === 'flagged';
    }
    
    return matchesSearch;
  });

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get badge variant based on fraud score
  const getFraudScoreBadge = (score: number) => {
    if (score < 30) return <Badge className="bg-green-100 text-green-800">Low Risk ({score})</Badge>;
    if (score < 70) return <Badge className="bg-yellow-100 text-yellow-800">Medium Risk ({score})</Badge>;
    return <Badge className="bg-red-100 text-red-800">High Risk ({score})</Badge>;
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-blue-100 text-blue-800">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-gray-100 text-gray-800">Failed</Badge>;
      case 'flagged':
        return <Badge className="bg-red-100 text-red-800">Flagged</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Open transaction detail dialog
  const openTransactionDetail = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDialogOpen(true);
  };

  // Handle local fraud detection toggle
  const handleLocalDetectionToggle = () => {
    setIsLocalDetectionEnabled(!isLocalDetectionEnabled);
    toast({
      title: isLocalDetectionEnabled ? "Local detection disabled" : "Local detection enabled",
      description: isLocalDetectionEnabled 
        ? "Fraud detection will now depend on server processing." 
        : "Fraud detection will now run locally on your device for faster response.",
    });
  };

  // Simulate a new transaction with local fraud detection
  const simulateTransaction = async () => {
    // Create a sample transaction
    const mockTransaction = {
      amount: Math.floor(Math.random() * 10000) + 100,
      timestamp: new Date(),
      merchantName: ["Walmart", "Amazon", "Flipkart", "Starbucks", "Unknown Merchant"][Math.floor(Math.random() * 5)],
      category: ["Shopping", "Food", "Electronics", "Travel", "Other"][Math.floor(Math.random() * 5)],
      location: {
        latitude: 28.6139 + (Math.random() * 0.1 - 0.05), // Random location near Delhi
        longitude: 77.2090 + (Math.random() * 0.1 - 0.05),
      },
    };

    // Check if we should run local fraud detection
    if (isLocalDetectionEnabled) {
      try {
        const detectionResult = fraudDetectionService.detectFraud(mockTransaction);
        
        // If fraud is detected, show an alert
        if (detectionResult.isAnomaly) {
          toast({
            title: "⚠️ Potential Fraud Detected",
            description: detectionResult.explanation,
            variant: "destructive",
          });
        }

        // Add transaction data to local storage for future detection
        fraudDetectionService.addTransaction(mockTransaction);

        // Create a transaction record on server
        const response = await fetch('/api/transactions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...mockTransaction,
            description: `${mockTransaction.merchantName} - ${mockTransaction.category}`,
            deviceId: 'browser-test-device',
            paymentMethod: 'credit_card',
            fraudScore: detectionResult.fraudScore,
            fraudFeatures: detectionResult.features,
          }),
        });

        if (response.ok) {
          // Refresh transaction list
          queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
          queryClient.invalidateQueries({ queryKey: ['/api/transactions/stats/summary'] });
          
          toast({
            title: "Transaction processed",
            description: detectionResult.isAnomaly 
              ? "Transaction was flagged by on-device fraud detection." 
              : "Transaction was processed successfully.",
          });
        }
      } catch (error) {
        console.error('Error processing transaction:', error);
        toast({
          title: "Error",
          description: "Failed to process transaction.",
          variant: "destructive",
        });
      }
    } else {
      // Just send to server without local detection
      try {
        await fetch('/api/transactions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...mockTransaction,
            description: `${mockTransaction.merchantName} - ${mockTransaction.category}`,
            deviceId: 'browser-test-device',
            paymentMethod: 'credit_card',
          }),
        });
        
        queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
        toast({
          title: "Transaction created",
          description: "Transaction has been created and will be analyzed for fraud by the server.",
        });
      } catch (error) {
        console.error('Error creating transaction:', error);
        toast({
          title: "Error",
          description: "Failed to create transaction.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Fraud Detection</h2>
          <p className="text-muted-foreground">
            Monitor transactions and detect fraud in real-time with on-device ML
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant={isLocalDetectionEnabled ? "default" : "outline"}
            size="sm"
            onClick={handleLocalDetectionToggle}
          >
            <Shield className="mr-2 h-4 w-4" />
            {isLocalDetectionEnabled ? "On-Device Detection Active" : "Server Detection Active"}
          </Button>
          <Button variant="outline" size="sm" onClick={simulateTransaction}>
            Simulate Transaction
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-muted-foreground" />
              <div className="text-sm font-medium text-muted-foreground">Total Transactions</div>
            </div>
            <div className="mt-1 text-2xl font-bold">
              {isLoadingStats ? "Loading..." : transactionStats?.totalCount || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <div className="text-sm font-medium text-muted-foreground">Transaction Volume</div>
            </div>
            <div className="mt-1 text-2xl font-bold">
              {isLoadingStats ? "Loading..." : formatCurrency(transactionStats?.totalAmount || 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <div className="text-sm font-medium text-muted-foreground">Flagged Transactions</div>
            </div>
            <div className="mt-1 text-2xl font-bold">
              {isLoadingStats ? "Loading..." : transactionStats?.flaggedCount || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-500" />
              <div className="text-sm font-medium text-muted-foreground">Fraud Detection Status</div>
            </div>
            <div className="mt-1">
              <div className="text-sm">
                {isLocalDetectionEnabled ? (
                  <Badge className="bg-green-100 text-green-800">On-Device Active</Badge>
                ) : (
                  <Badge className="bg-blue-100 text-blue-800">Server Mode</Badge>
                )}
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                {isLocalDetectionEnabled 
                  ? "Processing locally for faster response"
                  : "Using server processing for enhanced accuracy"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Detection Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                View and manage your recent transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select defaultValue="all" onValueChange={(value) => setViewMode(value as 'all' | 'flagged')}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="View Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Transactions</SelectItem>
                    <SelectItem value="flagged">Flagged Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead className="hidden md:table-cell">Date</TableHead>
                      <TableHead className="hidden md:table-cell">Status</TableHead>
                      <TableHead>Risk Score</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingTransactions ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">
                          Loading transactions...
                        </TableCell>
                      </TableRow>
                    ) : filteredTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">
                          No transactions found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTransactions.map((transaction: Transaction) => (
                        <TableRow key={transaction._id} className={transaction.status === 'flagged' ? 'bg-red-50' : ''}>
                          <TableCell>
                            <div className="font-medium">{transaction.description}</div>
                            <div className="text-xs text-muted-foreground">{transaction.merchantName}</div>
                          </TableCell>
                          <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {formatDate(transaction.timestamp)}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {getStatusBadge(transaction.status)}
                          </TableCell>
                          <TableCell>{getFraudScoreBadge(transaction.fraudScore)}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => openTransactionDetail(transaction)}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Fraud Detection Statistics</CardTitle>
                <CardDescription>
                  Insights from on-device fraud detection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="font-medium">Training Transactions</div>
                      <div>{fraudDetectionService.getStatistics().transactionsAnalyzed}</div>
                    </div>
                    <Progress value={
                      Math.min(fraudDetectionService.getStatistics().transactionsAnalyzed / 50 * 100, 100)
                    } />
                    <div className="text-xs text-muted-foreground">
                      {fraudDetectionService.getStatistics().transactionsAnalyzed >= 50 
                        ? "Training data complete" 
                        : "More transactions needed for better fraud detection"}
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <h4 className="mb-2 text-sm font-medium">Top Merchants</h4>
                    <div className="space-y-2">
                      {fraudDetectionService.getStatistics().topMerchants.map((merchant, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <div>{merchant.merchant}</div>
                          <div>{merchant.count} transactions</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground">
                Last updated: {fraudDetectionService.getStatistics().lastUpdated.toLocaleString()}
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Fraud Detection Features</CardTitle>
                <CardDescription>
                  The features used to detect fraud locally
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="amount">
                      <AccordionTrigger>
                        <div className="flex items-center">
                          <DollarSign className="mr-2 h-4 w-4" />
                          Amount Anomaly
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        Detects transactions that are unusually large or small compared to your typical spending patterns. This helps identify potential unauthorized charges.
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="location">
                      <AccordionTrigger>
                        <div className="flex items-center">
                          <MapPin className="mr-2 h-4 w-4" />
                          Location Analysis
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        Analyzes transaction locations against your normal spending locations. Helps detect if someone is using your account from an unusual location.
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="time">
                      <AccordionTrigger>
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4" />
                          Time Pattern Analysis
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        Examines when transactions occur and flags unusual timing based on your historical patterns. Helpful for detecting off-hours fraud attempts.
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="merchant">
                      <AccordionTrigger>
                        <div className="flex items-center">
                          <User className="mr-2 h-4 w-4" />
                          Merchant Frequency
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        Tracks which merchants you regularly do business with and flags transactions with unfamiliar or suspicious merchants.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => fraudDetectionService.reset()}
                >
                  Reset Detection Model
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Transaction Detail Dialog */}
      {selectedTransaction && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Transaction Details</DialogTitle>
              <DialogDescription>
                {selectedTransaction.status === 'flagged' ? (
                  <div className="mt-2 flex items-center text-red-500">
                    <AlertTriangle className="mr-1 h-4 w-4" />
                    This transaction has been flagged for fraud
                  </div>
                ) : null}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Merchant</h4>
                  <p className="text-base">{selectedTransaction.merchantName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Amount</h4>
                  <p className="text-base">{formatCurrency(selectedTransaction.amount)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Category</h4>
                  <p className="text-base">{selectedTransaction.category}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Date</h4>
                  <p className="text-base">{formatDate(selectedTransaction.timestamp)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Payment Method</h4>
                  <p className="text-base">{selectedTransaction.paymentMethod}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                  <p className="text-base">{getStatusBadge(selectedTransaction.status)}</p>
                </div>
              </div>
              
              {/* Fraud Score Section */}
              <div className="pt-2">
                <h4 className="mb-2 text-sm font-medium">Fraud Risk Score: {selectedTransaction.fraudScore}/100</h4>
                <Progress 
                  value={selectedTransaction.fraudScore} 
                  className={`h-2 ${
                    selectedTransaction.fraudScore > 70 
                      ? 'bg-red-100' 
                      : selectedTransaction.fraudScore > 30 
                        ? 'bg-yellow-100' 
                        : 'bg-green-100'
                  }`}
                />
                <div className="mt-2 text-xs text-muted-foreground">
                  {selectedTransaction.fraudScore > 70 
                    ? 'High risk transaction - additional verification recommended' 
                    : selectedTransaction.fraudScore > 30 
                      ? 'Medium risk - review transaction details' 
                      : 'Low risk transaction'}
                </div>
              </div>
              
              {/* Anomaly Features */}
              {selectedTransaction.fraudFeatures && (
                <div className="rounded-md bg-slate-50 p-3">
                  <h4 className="mb-2 text-sm font-medium">Risk Factors</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <div>Amount Deviation</div>
                      <Progress value={selectedTransaction.fraudFeatures.amountDeviation * 100} className="h-1 w-24" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>Location Anomaly</div>
                      <Progress value={selectedTransaction.fraudFeatures.locationAnomaly * 100} className="h-1 w-24" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>Time Anomaly</div>
                      <Progress value={selectedTransaction.fraudFeatures.timeAnomaly * 100} className="h-1 w-24" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>Merchant Anomaly</div>
                      <Progress value={selectedTransaction.fraudFeatures.merchantAnomaly * 100} className="h-1 w-24" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>Frequency Anomaly</div>
                      <Progress value={selectedTransaction.fraudFeatures.frequencyAnomaly * 100} className="h-1 w-24" />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter className="flex flex-col sm:flex-row sm:justify-between sm:space-x-2">
              {selectedTransaction.status === 'flagged' ? (
                <Button
                  variant="outline"
                  onClick={() => 
                    updateTransactionStatus.mutate({
                      id: selectedTransaction._id,
                      status: 'completed',
                      flaggedBy: null,
                    })
                  }
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark as Valid
                </Button>
              ) : (
                <Button
                  variant="destructive"
                  onClick={() => 
                    updateTransactionStatus.mutate({
                      id: selectedTransaction._id,
                      status: 'flagged',
                      flaggedBy: 'user',
                    })
                  }
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Report as Fraud
                </Button>
              )}
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}