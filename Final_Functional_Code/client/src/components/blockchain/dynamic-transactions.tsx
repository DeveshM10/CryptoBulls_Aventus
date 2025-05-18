"use client";

import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCcw,
  Search,
  Copy
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  id: string;
  hash: string;
  from: string;
  to: string;
  amount: string;
  type: "deposit" | "withdrawal" | "transfer";
  timestamp: string;
  status: "verified" | "pending" | "rejected";
  confirmations: number;
}

export function DynamicBlockchainTransactions() {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Generate a random Ethereum-like address
  const generateAddress = () => {
    let address = "0x";
    for (let i = 0; i < 40; i++) {
      address += Math.floor(Math.random() * 16).toString(16);
    }
    return address;
  };

  // Generate random transactions
  const generateRandomTransactions = (count: number) => {
    setIsLoading(true);
    const userAddress = generateAddress(); // Your address
    const types: ("deposit" | "withdrawal" | "transfer")[] = ["deposit", "withdrawal", "transfer"];
    const statuses: ("verified" | "pending" | "rejected")[] = ["verified", "pending", "rejected"];
    
    const newTransactions: Transaction[] = [];
    
    // Current time for the latest transaction
    const now = new Date();
    
    for (let i = 0; i < count; i++) {
      // Create a date slightly in the past for each transaction (between 0 and 7 days ago)
      const transactionDate = new Date(now);
      transactionDate.setDate(now.getDate() - Math.floor(Math.random() * 7));
      transactionDate.setHours(now.getHours() - Math.floor(Math.random() * 24));
      transactionDate.setMinutes(now.getMinutes() - Math.floor(Math.random() * 60));
      
      const type = types[Math.floor(Math.random() * types.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      // Generate addresses based on the transaction type
      let fromAddress = "";
      let toAddress = "";
      
      if (type === "deposit") {
        fromAddress = generateAddress();
        toAddress = userAddress;
      } else if (type === "withdrawal") {
        fromAddress = userAddress;
        toAddress = generateAddress();
      } else {
        fromAddress = userAddress;
        toAddress = generateAddress();
      }
      
      // Generate a plausible amount between 0.01 and 5 ETH
      const amount = (Math.random() * 4.99 + 0.01).toFixed(4) + " ETH";
      
      // Generate a hash
      let hash = "0x";
      for (let j = 0; j < 64; j++) {
        hash += Math.floor(Math.random() * 16).toString(16);
      }
      
      // Generate a more realistic number of confirmations based on status and timestamp
      let confirmations = 0;
      if (status === "verified") {
        // Older verified transactions have more confirmations (between 3 and 50)
        const ageInHours = (now.getTime() - transactionDate.getTime()) / (1000 * 60 * 60);
        confirmations = Math.min(50, Math.max(3, Math.floor(ageInHours)));
      } else if (status === "pending") {
        // Pending transactions have 0-2 confirmations
        confirmations = Math.floor(Math.random() * 3);
      }
      
      newTransactions.push({
        id: `tx-${Math.random().toString(36).substr(2, 9)}`,
        hash,
        from: fromAddress,
        to: toAddress,
        amount,
        type,
        timestamp: transactionDate.toISOString(),
        status,
        confirmations,
      });
    }
    
    // Sort transactions by timestamp, newest first
    newTransactions.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    setTransactions(newTransactions);
    setIsLoading(false);
    
    toast({
      title: "Blockchain Data Updated",
      description: `Successfully loaded ${count} blockchain transactions.`,
    });
  };

  // Generate initial transactions
  useEffect(() => {
    generateRandomTransactions(15);
  }, []);

  // Filter transactions based on current filter type
  const getFilteredTransactions = () => {
    let filtered = transactions;
    
    // Apply type filter
    if (filter !== "all") {
      filtered = filtered.filter(tx => tx.type === filter || tx.status === filter);
    }
    
    // Apply search filter if query exists
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tx => 
        tx.hash.toLowerCase().includes(query) ||
        tx.from.toLowerCase().includes(query) ||
        tx.to.toLowerCase().includes(query) ||
        tx.amount.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  };

  // Format address for display
  const formatAddress = (address: string) => {
    if (address.length < 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Copy to clipboard function
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The text has been copied to your clipboard.",
    });
  };

  // Format date and time
  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Verified
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 flex items-center gap-1">
            <Clock className="h-3 w-3" /> Pending
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 flex items-center gap-1">
            <XCircle className="h-3 w-3" /> Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
      case "withdrawal":
        return <ArrowUpRight className="h-4 w-4 text-red-500" />;
      case "transfer":
        return <RefreshCcw className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Blockchain Transactions</CardTitle>
            <CardDescription>
              Recent blockchain transactions and their status
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => generateRandomTransactions(15)}
            disabled={isLoading}
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4 space-y-4">
            {/* Search and Filter */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative md:col-span-3">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by hash, address or amount..."
                  className="w-full pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <Tabs 
                  defaultValue="all" 
                  className="w-full"
                  onValueChange={setFilter}
                >
                  <TabsList className="grid grid-cols-4 w-full">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="deposit">Deposits</TabsTrigger>
                    <TabsTrigger value="withdrawal">Withdrawals</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
            
            {/* Transactions Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tx Hash</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="hidden md:table-cell">From/To</TableHead>
                    <TableHead className="hidden md:table-cell">Time</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getFilteredTransactions().slice(0, 10).map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(tx.status)}
                          <span className="font-mono text-xs">{formatAddress(tx.hash)}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={() => copyToClipboard(tx.hash)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 capitalize">
                          {getTypeIcon(tx.type)}
                          <span>{tx.type}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {tx.amount}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1">
                            <span className="text-xs text-muted-foreground">From:</span>
                            <span className="font-mono text-xs">{formatAddress(tx.from)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-xs text-muted-foreground">To:</span>
                            <span className="font-mono text-xs">{formatAddress(tx.to)}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="text-xs">
                          {formatDateTime(tx.timestamp)}
                          <div className="text-muted-foreground mt-1">
                            {tx.confirmations} confirmation{tx.confirmations !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(tx.status)}
                      </TableCell>
                    </TableRow>
                  ))}

                  {getFilteredTransactions().length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No transactions found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Transaction Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <Card className="bg-muted/20">
              <CardContent className="p-4">
                <div className="text-sm font-medium">Total Transactions</div>
                <div className="text-2xl font-bold mt-1">{transactions.length}</div>
              </CardContent>
            </Card>
            <Card className="bg-muted/20">
              <CardContent className="p-4">
                <div className="text-sm font-medium">Verified</div>
                <div className="text-2xl font-bold text-green-600 mt-1">
                  {transactions.filter(tx => tx.status === "verified").length}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-muted/20">
              <CardContent className="p-4">
                <div className="text-sm font-medium">Pending</div>
                <div className="text-2xl font-bold text-amber-600 mt-1">
                  {transactions.filter(tx => tx.status === "pending").length}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-muted/20">
              <CardContent className="p-4">
                <div className="text-sm font-medium">Recent Activity</div>
                <div className="flex items-center mt-1">
                  {transactions.slice(0, 3).map((tx, index) => (
                    <div key={index} className="mr-1">
                      {getStatusIcon(tx.status)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}