import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Asset } from "./add-asset-form";

// Colors for the chart segments
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c", "#d0ed57"];

export function AssetDistributionChart() {
  const [chartData, setChartData] = useState<any[]>([]);

  // Fetch assets from the API
  const { data: assets, isLoading, error } = useQuery({
    queryKey: ["/api/assets"],
    queryFn: async () => {
      const response = await fetch("/api/assets");
      if (!response.ok) {
        throw new Error("Failed to fetch assets");
      }
      return response.json();
    }
  });

  // Process assets data for the chart
  useEffect(() => {
    if (assets && assets.length > 0) {
      // Group assets by type and calculate total value for each type
      const assetsByType = assets.reduce((acc: Record<string, number>, asset: Asset) => {
        const type = asset.type;
        const valueStr = asset.value.replace(/[^0-9.-]+/g, "");
        const valueNum = parseFloat(valueStr);
        
        if (!isNaN(valueNum)) {
          acc[type] = (acc[type] || 0) + valueNum;
        }
        return acc;
      }, {});

      // Convert to array format required by Recharts
      const chartData = Object.entries(assetsByType).map(([name, value], index) => ({
        name,
        value,
        color: COLORS[index % COLORS.length]
      }));

      setChartData(chartData);
    } else {
      setChartData([]);
    }
  }, [assets]);

  // Display a loading state if the data is being fetched
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Asset Distribution</CardTitle>
          <CardDescription>Loading asset data...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-80">
          <div className="animate-pulse w-full h-64 bg-muted rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  // Display an error state if there was a problem
  if (error) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Asset Distribution</CardTitle>
          <CardDescription>Error loading assets</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-80">
          <div className="text-destructive">Failed to load asset data</div>
        </CardContent>
      </Card>
    );
  }

  // Display a message if there's no data to show
  if (!chartData.length) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Asset Distribution</CardTitle>
          <CardDescription>Distribution of your assets by type</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-80">
          <p className="text-muted-foreground">No assets to display. Add assets to see your distribution.</p>
        </CardContent>
      </Card>
    );
  }

  // Calculate total value of all assets
  const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);
  const formattedTotal = new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(totalValue);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Asset Distribution</CardTitle>
        <CardDescription>Total Assets: {formattedTotal}</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={true}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => new Intl.NumberFormat('en-US', { 
                style: 'currency', 
                currency: 'USD' 
              }).format(value as number)}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}