"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import {
  Line,
  LineChart as RechartsLineChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

// Using the same data structure as BarChart
export interface FinancialChartData {
  month: number;
  year: number;
  period?: string;
  INCOME: number;
  EXPENSE: number;
}

interface TransactionLineChartProps {
  data?: FinancialChartData[];
  isLoading?: boolean;
  error?: Error | null;
  title?: string;
  description?: string;
  showFooter?: boolean;
}

// Update chart config for income and expense
const chartConfig = {
  expense: {
    label: "Expense",
    color: "hsl(var(--chart-1))",
  },
  income: {
    label: "Income",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

// Function to format month numbers to month names
const formatMonth = (month: number) => {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return monthNames[month - 1];
};

const TransactionLineChart = ({
  data = [],
  isLoading = false,
  error = null,
  title = "Income vs. Expense Trend",
  description,
  showFooter = true,
}: TransactionLineChartProps) => {
  // Generate description dynamically if not provided
  const chartDescription =
    description ||
    (() => {
      if (data.length === 0) return "No data available";

      // Sort data by year and month
      const sortedData = [...data].sort((a, b) => {
        return a.year !== b.year ? a.year - b.year : a.month - b.month;
      });

      const firstMonth = sortedData[0];
      const lastMonth = sortedData[sortedData.length - 1];

      if (firstMonth.year === lastMonth.year) {
        if (firstMonth.month === lastMonth.month) {
          return `${formatMonth(firstMonth.month)} ${firstMonth.year}`;
        }
        return `${formatMonth(firstMonth.month)} - ${formatMonth(
          lastMonth.month
        )} ${firstMonth.year}`;
      }

      return `${formatMonth(firstMonth.month)} ${
        firstMonth.year
      } - ${formatMonth(lastMonth.month)} ${lastMonth.year}`;
    })();

  // Calculate net income trend
  const calculateTrend = () => {
    if (data.length < 2) return 0;

    // Sort data by year and month to ensure correct trending
    const sortedData = [...data].sort((a, b) => {
      return a.year !== b.year ? a.year - b.year : a.month - b.month;
    });

    const currentMonth = sortedData[sortedData.length - 1];
    const previousMonth = sortedData[sortedData.length - 2];

    const currentNetIncome = currentMonth.INCOME - currentMonth.EXPENSE;
    const previousNetIncome = previousMonth.INCOME - previousMonth.EXPENSE;

    if (previousNetIncome === 0) return 0;
    return (
      ((currentNetIncome - previousNetIncome) / Math.abs(previousNetIncome)) *
      100
    );
  };

  const trend = calculateTrend();
  const netIncome = data.reduce(
    (sum, item) => sum + (item.INCOME - item.EXPENSE),
    0
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/3 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error Loading Chart</CardTitle>
          <CardDescription>Failed to load financial data</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px] text-destructive">
          {error?.message || "There was an error loading the chart data"}
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px] text-muted-foreground">
          No financial data found for the selected period
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{chartDescription}</CardDescription>
      </CardHeader>
      <CardContent className="w-[500px]">
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsLineChart data={data}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => formatMonth(value)}
              />
              <YAxis
                tickFormatter={(value) => `₱${value}`}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(value) => [`₱${value}`, undefined]}
                labelFormatter={(label) => formatMonth(Number(label))}
                cursor={{ strokeDasharray: "5 5" }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="EXPENSE"
                name="Expense"
                stroke="var(--color-expense)"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="INCOME"
                name="Income"
                stroke="var(--color-income)"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      {showFooter && (
        <CardFooter className={"flex-col items-start gap-2 text-sm"}>
          <div className="flex gap-2 font-medium leading-none">
            {trend > 0 ? (
              <>
                Net income trending up by {trend.toFixed(1)}%{" "}
                <TrendingUp className="h-4 w-4 text-green-500" />
              </>
            ) : trend < 0 ? (
              <>
                Net income trending down by {Math.abs(trend).toFixed(1)}%{" "}
                <TrendingDown className="h-4 w-4 text-red-500" />
              </>
            ) : (
              <>No change in net income</>
            )}
          </div>
          <div className="leading-none text-muted-foreground">
            Net income: ₱{netIncome.toLocaleString()}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default TransactionLineChart;
