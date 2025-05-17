import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Plus, TrendingUp, ArrowUpRight, Filter, Download, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { VoiceAssetModal } from "@/components/voice-input/voice-asset-modal";

// Define asset form schema
const assetFormSchema = z.object({
  title: z.string().min(2, "Asset name must be at least 2 characters"),
  value: z.string().min(1, "Asset value is required"),
  type: z.string().min(1, "Asset type is required"),
  date: z.string().min(1, "Date is required"),
  change: z.string().default("0%"),
  trend: z.enum(["up", "down"]).default("up"),
});

type AssetFormValues = z.infer<typeof assetFormSchema>;

// Asset Types List
const assetTypes = [
  { value: "real_estate", label: "Real Estate" },
  { value: "stocks", label: "Stocks" },
  { value: "crypto", label: "Cryptocurrency" },
  { value: "cash", label: "Cash & Equivalents" },
  { value: "vehicles", label: "Vehicles" },
  { value: "collectibles", label: "Collectibles & Art" },
  { value: "retirement", label: "Retirement Accounts" },
  { value: "other", label: "Other" },
];

// Custom tooltip component for charts
const CustomTooltip = ({ active, payload, formatter }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-md shadow-sm p-2 text-sm">
        <p className="font-medium">{payload[0].name}</p>
        <p className="text-primary">${Number(payload[0].value).toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export default function AssetsPage() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  
  // Set up form
  const form = useForm<AssetFormValues>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: {
      title: "",
      value: "",
      type: "",
      date: new Date().toISOString().split('T')[0],
      change: "0%",
      trend: "up",
    },
  });
  
  // Query to fetch assets
  const { data: assets = [], isLoading } = useQuery({
    queryKey: ['/api/assets'],
    queryFn: async () => {
      const response = await fetch('/api/assets');
      if (!response.ok) {
        throw new Error('Failed to fetch assets');
      }
      return response.json();
    },
  });
  
  // Mutation to create a new asset
  const createAssetMutation = useMutation({
    mutationFn: async (newAsset: AssetFormValues) => {
      const response = await fetch('/api/assets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAsset),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create asset');
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Close the dialog and reset form
      setOpen(false);
      form.reset();
      
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['/api/assets'] });
      
      // Show success message
      toast({
        title: "Asset Added",
        description: "Your asset has been successfully added.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add asset. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Handle form submission
  function onSubmit(data: AssetFormValues) {
    createAssetMutation.mutate(data);
  }
  
  // Define asset interface to fix type issues
  interface Asset {
    _id: string;
    userId: string;
    title: string;
    value: string;
    type: string;
    date: string;
    change: string;
    trend: 'up' | 'down';
  }
  
  // Handle voice input asset addition
  const handleAddAssetViaVoice = (newAsset: any) => {
    // Invalidate queries to refresh data
    queryClient.invalidateQueries({ queryKey: ['/api/assets'] });
    
    // Show success message
    toast({
      title: "Asset Added",
      description: "Your asset has been successfully added via voice input.",
    });
  };
  
  // Calculate totals and prepare chart data
  const totalAssetValue = assets.reduce((sum: number, asset: Asset) => 
    sum + Number(asset.value.replace(/[^0-9.-]+/g, '')), 0);
  
  // Prepare chart data for asset types distribution
  type ChartDataItem = { name: string; value: number };
  
  const assetTypeData = assets.reduce((acc: ChartDataItem[], asset: Asset) => {
    const existingType = acc.find(item => item.name === asset.type);
    const assetValue = Number(asset.value.replace(/[^0-9.-]+/g, ''));
    
    if (existingType) {
      existingType.value += assetValue;
    } else {
      acc.push({
        name: asset.type,
        value: assetValue
      });
    }
    
    return acc;
  }, []);
  
  // Prepare data for asset growth chart - simplified version
  const currentMonth = new Date().getMonth();
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(currentMonth - 5 + i);
    return date.toLocaleString('default', { month: 'short' });
  });
  
  const growthData = last6Months.map(month => {
    const assetsForMonth = assets.filter((asset: Asset) => 
      asset.date.includes(month)
    );
    const totalForMonth = assetsForMonth.reduce(
      (sum: number, asset: Asset) => sum + Number(asset.value.replace(/[^0-9.-]+/g, '')), 
      0
    );
    
    return {
      name: month,
      value: totalForMonth || 0
    };
  });
  
  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a855f7', '#ec4899'];
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b bg-background px-4 py-3 md:px-6">
        <div className="flex items-center gap-2">
          <a className="mr-6 flex items-center gap-2 md:mr-8" href="/">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span className="font-bold">FinVault</span>
          </a>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content area with padding for fixed sidebar */}
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 ml-0 md:ml-64 lg:ml-72">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 overflow-x-auto py-2">
            <h1 className="text-2xl font-bold whitespace-nowrap">Assets</h1>
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <Button variant="outline" size="sm" className="flex-shrink-0">
                <Filter className="mr-2 h-4 w-4" />
                <span className="whitespace-nowrap">Filter</span>
              </Button>
              <Button variant="outline" size="sm" className="flex-shrink-0">
                <Download className="mr-2 h-4 w-4" />
                <span className="whitespace-nowrap">Export</span>
              </Button>
              {/* Voice Asset Input */}
              <VoiceAssetModal onAddAsset={handleAddAssetViaVoice} />
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="flex-shrink-0 w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    <span className="whitespace-nowrap">Add Asset</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px]">
                  <DialogHeader>
                    <DialogTitle>Add New Asset</DialogTitle>
                    <DialogDescription>
                      Add details of your asset below. Click save when you're done.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Asset Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Primary Home, Tesla Stock" {...field} />
                            </FormControl>
                            <FormDescription>
                              Enter the name of your asset
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="value"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Value (₹)</FormLabel>
                            <FormControl>
                              <Input type="text" placeholder="e.g., 100000" {...field} />
                            </FormControl>
                            <FormDescription>
                              Current value of your asset in INR
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Asset Type</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select asset type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {assetTypes.map((type) => (
                                  <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              The category this asset belongs to
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date Added/Purchased</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormDescription>
                              When you acquired this asset
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="change"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Change Percentage</FormLabel>
                            <FormControl>
                              <Input 
                                type="text" 
                                placeholder="e.g., 5.2%" 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              How much has this asset changed in value (e.g., 5.2%)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="trend"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Trend Direction</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select trend" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="up">Up</SelectItem>
                                <SelectItem value="down">Down</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Is the asset value trending up or down?
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter>
                        <Button 
                          type="submit" 
                          disabled={createAssetMutation.isPending}
                        >
                          {createAssetMutation.isPending ? "Adding..." : "Add Asset"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{totalAssetValue.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">+₹{(totalAssetValue * 0.02).toLocaleString()} from last month</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.5%</div>
                <div className="flex items-center text-xs text-green-500">
                  <ArrowUpRight className="mr-1 h-4 w-4" />
                  <span>Up from 1.8% last quarter</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Real Estate</CardTitle>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₹
                  {assets
                    .filter((asset: Asset) => asset.type.includes('real_estate'))
                    .reduce((sum: number, asset: Asset) => sum + Number(asset.value.replace(/[^0-9.-]+/g, '')), 0)
                    .toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  {assets.filter((asset: Asset) => asset.type.includes('real_estate')).length} <span className="ml-1">properties</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Investments</CardTitle>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₹
                  {assets
                    .filter((asset: Asset) => ['stocks', 'crypto', 'retirement'].some(type => asset.type.includes(type)))
                    .reduce((sum: number, asset: Asset) => sum + Number(asset.value.replace(/[^0-9.-]+/g, '')), 0)
                    .toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  {assets.filter((asset: Asset) => ['stocks', 'crypto', 'retirement'].some(type => asset.type.includes(type))).length} <span className="ml-1">investment assets</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Asset Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={assetTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {assetTypeData.map((entry: ChartDataItem, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Asset Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={growthData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="value" stroke="#6366F1" activeDot={{ r: 8 }} name="Total Value" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your Assets</CardTitle>
            </CardHeader>
            <CardContent>
              {assets.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No assets found</p>
                  <p className="text-sm text-muted-foreground text-center mb-6">
                    Start tracking your assets by adding your first one.
                  </p>
                  <Button onClick={() => setOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Asset
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {assets.map((asset: Asset) => (
                    <div key={asset._id} className="flex items-center justify-between space-x-4 rounded-md border p-4">
                      <div className="space-y-1">
                        <p className="font-medium">{asset.title}</p>
                        <p className="text-sm text-muted-foreground">Type: {asset.type}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex flex-col items-end">
                          <p className="font-medium">₹{Number(asset.value.replace(/[^0-9.-]+/g, '')).toLocaleString()}</p>
                          <div className={`text-xs ${asset.trend === 'up' ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                            {asset.trend === 'up' ? (
                              <ArrowUpRight className="mr-1 h-3 w-3" />
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 h-3 w-3">
                                <line x1="7" y1="7" x2="17" y2="17"></line>
                                <polyline points="17 7 17 17 7 17"></polyline>
                              </svg>
                            )}
                            {asset.change}
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                          </svg>
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                          </svg>
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}