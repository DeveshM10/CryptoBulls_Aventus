import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Plus, TrendingUp, ArrowUpRight, Filter, Download } from "lucide-react";
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
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a className="font-medium transition-colors hover:text-primary" href="/">Dashboard</a>
            <a className="font-medium transition-colors hover:text-primary text-primary" href="/assets">Assets</a>
            <a className="font-medium transition-colors hover:text-primary" href="/liabilities">Liabilities</a>
            <a className="font-medium transition-colors hover:text-primary" href="/budget">Budget</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content area with padding for fixed sidebar */}
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 ml-0 md:ml-64 lg:ml-72">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Assets</h1>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Asset
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$164,320.25</div>
                <p className="text-xs text-muted-foreground">
                  +5.2% <span className="ml-1">from last month</span>
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Real Estate</CardTitle>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$120,000.00</div>
                <p className="text-xs text-muted-foreground">
                  +2.5% <span className="ml-1">from last month</span>
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Investments</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$37,500.75</div>
                <p className="text-xs text-muted-foreground">
                  +12.3% <span className="ml-1">from last month</span>
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cash & Equivalents</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$6,819.50</div>
                <p className="text-xs text-muted-foreground">
                  +1.8% <span className="ml-1">from last month</span>
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>Asset Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center border rounded-lg">
              <p className="text-sm text-muted-foreground">Asset distribution chart will display here</p>
            </CardContent>
          </Card>
          
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>Asset Growth</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center border rounded-lg">
              <p className="text-sm text-muted-foreground">Asset growth chart will display here</p>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}