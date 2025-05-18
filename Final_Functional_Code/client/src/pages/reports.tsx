import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, FileSpreadsheet, Calendar, BarChart4, PieChart } from "lucide-react";
import { ReportButton } from "@/components/reports/report-button";
import { useQuery } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Asset } from "@/types/asset";
import { Liability } from "@/types/liability";
import { Budget } from "@/types/budget";

export default function ReportsPage() {
  const [reportType, setReportType] = useState<string>("financial");
  const [dateRange, setDateRange] = useState<string>("all");
  const { toast } = useToast();
  
  const { data: assets } = useQuery<Asset[]>({
    queryKey: ["/api/assets"],
    staleTime: 1000 * 60 * 5,
  });

  const { data: liabilities } = useQuery<Liability[]>({
    queryKey: ["/api/liabilities"],
    staleTime: 1000 * 60 * 5,
  });

  const { data: budgetItems } = useQuery<Budget[]>({
    queryKey: ["/api/budget"],
    staleTime: 1000 * 60 * 5,
  });

  // Calculate totals
  const totalAssets = assets?.reduce((sum, asset) => {
    const value = asset.value.replace(/[^0-9.-]+/g, '');
    return sum + (parseFloat(value) || 0);
  }, 0) || 0;

  const totalLiabilities = liabilities?.reduce((sum, liability) => {
    const amount = liability.amount.replace(/[^0-9.-]+/g, '');
    return sum + (parseFloat(amount) || 0);
  }, 0) || 0;

  const netWorth = totalAssets - totalLiabilities;

  return (
    <MainLayout>
      <Helmet>
        <title>Financial Reports | FinVault</title>
      </Helmet>
      <div className="container mx-auto py-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Financial Reports</h1>
              <p className="text-muted-foreground">
                Generate comprehensive reports of your financial data
              </p>
            </div>
            <ReportButton />
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="configure">Configure Reports</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">₹{totalAssets.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {assets?.length || 0} assets tracked
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Liabilities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">₹{totalLiabilities.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {liabilities?.length || 0} liabilities tracked
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${netWorth < 0 ? 'text-red-500' : 'text-green-500'}`}>
                      ₹{netWorth.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {netWorth < 0 ? 'Needs attention' : 'Looking good'}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Available Reports</CardTitle>
                    <CardDescription>
                      Choose a report type to generate detailed financial insights
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-2 border-primary/20 hover:border-primary transition-all cursor-pointer">
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-primary" />
                          <CardTitle className="text-base">Complete Financial Report</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>
                          A comprehensive overview of your assets, liabilities, budget, and financial health.
                        </CardDescription>
                        <Button className="w-full mt-4" onClick={() => {
                          window.open('/api/generate-report', '_blank');
                        }}>Generate</Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="border hover:border-primary/50 transition-all cursor-pointer">
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <PieChart className="h-5 w-5 text-blue-500" />
                          <CardTitle className="text-base">Asset Distribution Report</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>
                          Detailed analysis of your asset allocation and distribution across different categories.
                        </CardDescription>
                        <Button variant="outline" className="w-full mt-4" onClick={() => {
                          toast({
                            title: "Coming Soon",
                            description: "This report type will be available in a future update.",
                          });
                        }}>Coming Soon</Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="border hover:border-primary/50 transition-all cursor-pointer">
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <BarChart4 className="h-5 w-5 text-green-500" />
                          <CardTitle className="text-base">Budget Analysis Report</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>
                          Comprehensive budget analysis with spending patterns and recommendations.
                        </CardDescription>
                        <Button variant="outline" className="w-full mt-4" onClick={() => {
                          toast({
                            title: "Coming Soon",
                            description: "This report type will be available in a future update.",
                          });
                        }}>Coming Soon</Button>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="configure">
              <Card>
                <CardHeader>
                  <CardTitle>Report Configuration</CardTitle>
                  <CardDescription>
                    Customize the type of report and data range to generate
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Report Type</h3>
                    <RadioGroup defaultValue="financial" value={reportType} onValueChange={setReportType} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <RadioGroupItem value="financial" id="financial" className="peer sr-only" />
                        <Label 
                          htmlFor="financial" 
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <FileText className="mb-3 h-6 w-6" />
                          <span className="text-center font-medium">Financial Summary</span>
                        </Label>
                      </div>
                      
                      <div>
                        <RadioGroupItem value="asset" id="asset" className="peer sr-only" />
                        <Label 
                          htmlFor="asset" 
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <FileSpreadsheet className="mb-3 h-6 w-6" />
                          <span className="text-center font-medium">Asset Report</span>
                        </Label>
                      </div>
                      
                      <div>
                        <RadioGroupItem value="budget" id="budget" className="peer sr-only" />
                        <Label 
                          htmlFor="budget" 
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <BarChart4 className="mb-3 h-6 w-6" />
                          <span className="text-center font-medium">Budget Report</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Date Range</h3>
                    <RadioGroup defaultValue="all" value={dateRange} onValueChange={setDateRange} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <RadioGroupItem value="all" id="all" className="peer sr-only" />
                        <Label 
                          htmlFor="all" 
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <Calendar className="mb-3 h-6 w-6" />
                          <span className="text-center font-medium">All Time</span>
                        </Label>
                      </div>
                      
                      <div>
                        <RadioGroupItem value="year" id="year" className="peer sr-only" />
                        <Label 
                          htmlFor="year" 
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <Calendar className="mb-3 h-6 w-6" />
                          <span className="text-center font-medium">This Year</span>
                        </Label>
                      </div>
                      
                      <div>
                        <RadioGroupItem value="month" id="month" className="peer sr-only" />
                        <Label 
                          htmlFor="month" 
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <Calendar className="mb-3 h-6 w-6" />
                          <span className="text-center font-medium">This Month</span>
                        </Label>
                      </div>
                      
                      <div>
                        <RadioGroupItem value="custom" id="custom" className="peer sr-only" />
                        <Label 
                          htmlFor="custom" 
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <Calendar className="mb-3 h-6 w-6" />
                          <span className="text-center font-medium">Custom Range</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <Button variant="outline" className="mr-2" onClick={() => {
                      setReportType("financial");
                      setDateRange("all");
                    }}>
                      Reset
                    </Button>
                    <Button onClick={() => {
                      toast({
                        title: "Generate Report",
                        description: `Creating ${reportType} report for ${dateRange} time range`,
                      });
                      window.open('/api/generate-report', '_blank');
                    }}>
                      Generate Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}