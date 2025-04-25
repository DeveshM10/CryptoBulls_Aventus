import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Asset } from "./asset/add-asset-form";
import { Liability } from "./liability/add-liability-form";

export function ComparisonChart() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [netWorth, setNetWorth] = useState<number>(0);

  // Fetch assets from the API
  const { data: assets, isLoading: assetsLoading } = useQuery({
    queryKey: ["/api/assets"],
    queryFn: async () => {
      const response = await fetch("/api/assets");
      if (!response.ok) {
        throw new Error("Failed to fetch assets");
      }
      return response.json();
    }
  });

  // Fetch liabilities from the API
  const { data: liabilities, isLoading: liabilitiesLoading } = useQuery({
    queryKey: ["/api/liabilities"],
    queryFn: async () => {
      const response = await fetch("/api/liabilities");
      if (!response.ok) {
        throw new Error("Failed to fetch liabilities");
      }
      return response.json();
    }
  });

  // Process data for the chart
  useEffect(() => {
    if (assets && liabilities) {
      // Calculate total assets
      const totalAssets = assets.reduce((total: number, asset: Asset) => {
        const valueStr = asset.value.replace(/[^0-9.-]+/g, "");
        const value = parseFloat(valueStr);
        return isNaN(value) ? total : total + value;
      }, 0);

      // Calculate total liabilities
      const totalLiabilities = liabilities.reduce((total: number, liability: Liability) => {
        const amountStr = liability.amount.replace(/[^0-9.-]+/g, "");
        const amount = parseFloat(amountStr);
        return isNaN(amount) ? total : total + amount;
      }, 0);

      // Calculate net worth
      const calculatedNetWorth = totalAssets - totalLiabilities;
      setNetWorth(calculatedNetWorth);

      // Prepare data for the chart
      setChartData([
        {
          name: "Assets",
          value: totalAssets,
          color: "#82ca9d" // Green for assets
        },
        {
          name: "Liabilities",
          value: totalLiabilities,
          color: "#ff8042" // Orange for liabilities
        },
        {
          name: "Net Worth",
          value: calculatedNetWorth,
          color: calculatedNetWorth >= 0 ? "#8884d8" : "#d32f2f" // Purple for positive, red for negative
        }
      ]);
    }
  }, [assets, liabilities]);

  // Display a loading state if the data is being fetched
  if (assetsLoading || liabilitiesLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Financial Comparison</CardTitle>
          <CardDescription>Loading financial data...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-80">
          <div className="animate-pulse w-full h-64 bg-muted rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  // Format the net worth for display
  const formattedNetWorth = new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(netWorth);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Financial Comparison</CardTitle>
        <CardDescription>
          Net Worth: <span className={netWorth >= 0 ? "text-green-600" : "text-red-600"}>{formattedNetWorth}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis 
              tickFormatter={(value) => new Intl.NumberFormat('en-US', { 
                notation: 'compact',
                compactDisplay: 'short'
              }).format(value)}
            />
            <Tooltip 
              formatter={(value) => new Intl.NumberFormat('en-US', { 
                style: 'currency', 
                currency: 'USD' 
              }).format(value as number)}
            />
            <Legend />
            <Bar dataKey="value">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}