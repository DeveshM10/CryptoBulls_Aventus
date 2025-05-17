import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { DailyExpense } from "@/types/expenses";

interface ExpenseByCategoryChartProps {
  expenses: DailyExpense[];
}

export function ExpenseByCategoryChart({ expenses }: ExpenseByCategoryChartProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Only show the chart after mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading chart...</p>
      </div>
    );
  }

  // Extract numeric value from formatted currency string
  const extractNumericValue = (value: string): number => {
    // Remove ₹ and commas, then parse as float
    const numericString = value.replace(/[₹,]/g, "");
    return Number.parseFloat(numericString) || 0;
  };

  // Group expenses by category and calculate total value
  const expensesByCategory = expenses.reduce(
    (acc, expense) => {
      const category = expense.category;
      const value = typeof expense.amount === 'string' 
        ? extractNumericValue(expense.amount) 
        : Number(expense.amount);

      if (!acc[category]) {
        acc[category] = { name: category, value: 0 };
      }

      acc[category].value += value;
      return acc;
    },
    {} as Record<string, { name: string; value: number }>
  );

  const chartData = Object.values(expensesByCategory);

  // Define colors for the chart
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: number) => `₹${value.toLocaleString("en-IN")}`} 
          contentStyle={{ 
            backgroundColor: resolvedTheme === "dark" ? "#1f2937" : "#fff",
            borderColor: resolvedTheme === "dark" ? "#374151" : "#e5e7eb",
            color: resolvedTheme === "dark" ? "#f9fafb" : "#111827"
          }}
        />
        <Legend layout="vertical" verticalAlign="middle" align="right" />
      </PieChart>
    </ResponsiveContainer>
  );
}