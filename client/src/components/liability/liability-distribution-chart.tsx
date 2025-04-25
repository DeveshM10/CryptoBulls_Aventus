import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Liability } from "./add-liability-form";

// Colors for the chart segments (different from asset colors for visual distinction)
const COLORS = ["#ff8042", "#ffc658", "#a4de6c", "#82ca9d", "#8884d8", "#d0ed57"];

export function LiabilityDistributionChart() {
  const [chartData, setChartData] = useState<any[]>([]);

  // Fetch liabilities from the API
  const { data: liabilities, isLoading, error } = useQuery({
    queryKey: ["/api/liabilities"],
    queryFn: async () => {
      const response = await fetch("/api/liabilities");
      if (!response.ok) {
        throw new Error("Failed to fetch liabilities");
      }
      return response.json();
    }
  });

  // Process liabilities data for the chart
  useEffect(() => {
    if (liabilities && liabilities.length > 0) {
      // Group liabilities by type and calculate total value for each type
      const liabilitiesByType = liabilities.reduce((acc: Record<string, number>, liability: Liability) => {
        const type = liability.type;
        const valueStr = liability.amount.replace(/[^0-9.-]+/g, "");
        const valueNum = parseFloat(valueStr);
        
        if (!isNaN(valueNum)) {
          acc[type] = (acc[type] || 0) + valueNum;
        }
        return acc;
      }, {});

      // Convert to array format required by Recharts
      const chartData = Object.entries(liabilitiesByType).map(([name, value], index) => ({
        name,
        value,
        color: COLORS[index % COLORS.length]
      }));

      setChartData(chartData);
    } else {
      setChartData([]);
    }
  }, [liabilities]);

  // Display a loading state if the data is being fetched
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Liability Distribution</CardTitle>
          <CardDescription>Loading liability data...</CardDescription>
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
          <CardTitle>Liability Distribution</CardTitle>
          <CardDescription>Error loading liabilities</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-80">
          <div className="text-destructive">Failed to load liability data</div>
        </CardContent>
      </Card>
    );
  }

  // Display a message if there's no data to show
  if (!chartData.length) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Liability Distribution</CardTitle>
          <CardDescription>Distribution of your liabilities by type</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-80">
          <p className="text-muted-foreground">No liabilities to display. Add liabilities to see your distribution.</p>
        </CardContent>
      </Card>
    );
  }

  // Calculate total value of all liabilities
  const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);
  const formattedTotal = new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(totalValue);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Liability Distribution</CardTitle>
        <CardDescription>Total Liabilities: {formattedTotal}</CardDescription>
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
              fill="#ff8042"
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