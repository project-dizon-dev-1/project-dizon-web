"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import {
  Line,
  LineChart as RechartsLineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { useMemo, useState } from "react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const ALL_YEARS_VALUE = "__ALL_YEARS__"; // Define a constant for the "All Years" value

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
  data: initialData = [],
  isLoading = false,
  error = null,
  title = "Income vs. Expense Trend",
  description: initialDescription,
  showFooter = true,
}: TransactionLineChartProps) => {
  const [selectedYear, setSelectedYear] = useState<string>(ALL_YEARS_VALUE); // Default to "All Years"

  const yearOptions = useMemo(() => {
    if (!initialData || initialData.length === 0) return [];
    const years = Array.from(
      new Set(initialData.map((item) => item.year))
    ).sort((a, b) => b - a);
    return [
      { label: "All Years", value: ALL_YEARS_VALUE }, // Use the constant
      ...years.map((year) => ({ label: String(year), value: String(year) })),
    ];
  }, [initialData]);

  const filteredData = useMemo(() => {
    if (selectedYear === ALL_YEARS_VALUE) return initialData; // Check against the constant
    const yearNumber = Number(selectedYear);
    return initialData.filter((item) => item.year === yearNumber);
  }, [initialData, selectedYear]);

  const chartDescription = useMemo(() => {
    if (initialDescription) return initialDescription;
    if (filteredData.length === 0)
      return "No data available for the selected period.";

    const sortedData = [...filteredData].sort((a, b) => {
      return a.year !== b.year ? a.year - b.year : a.month - b.month;
    });

    if (sortedData.length === 0)
      return "No data available for the selected period.";

    const firstMonth = sortedData[0];
    const lastMonth = sortedData[sortedData.length - 1];

    if (selectedYear !== ALL_YEARS_VALUE) {
      // Check against the constant
      if (sortedData.length === 1) {
        return `${formatMonth(firstMonth.month)} ${firstMonth.year}`;
      }
      return `${formatMonth(firstMonth.month)} - ${formatMonth(
        lastMonth.month
      )} ${selectedYear}`;
    }
    // For "All Years"
    if (firstMonth.year === lastMonth.year) {
      if (firstMonth.month === lastMonth.month) {
        return `${formatMonth(firstMonth.month)} ${firstMonth.year}`;
      }
      return `${formatMonth(firstMonth.month)} - ${formatMonth(
        lastMonth.month
      )} ${firstMonth.year}`;
    }
    return `${formatMonth(firstMonth.month)} ${firstMonth.year} - ${formatMonth(
      lastMonth.month
    )} ${lastMonth.year}`;
  }, [filteredData, initialDescription, selectedYear]);

  const trend = useMemo(() => {
    if (filteredData.length < 2) return 0;

    const sortedData = [...filteredData].sort((a, b) => {
      return a.year !== b.year ? a.year - b.year : a.month - b.month;
    });

    const currentMonthData = sortedData[sortedData.length - 1];
    const previousMonthData = sortedData[sortedData.length - 2];

    const currentNetIncome = currentMonthData.INCOME - currentMonthData.EXPENSE;
    const previousNetIncome =
      previousMonthData.INCOME - previousMonthData.EXPENSE;

    if (previousNetIncome === 0)
      return currentNetIncome > 0
        ? Infinity
        : currentNetIncome < 0
        ? -Infinity
        : 0;
    return (
      ((currentNetIncome - previousNetIncome) / Math.abs(previousNetIncome)) *
      100
    );
  }, [filteredData]);

  const netIncome = useMemo(() => {
    return filteredData.reduce(
      (sum, item) => sum + (item.INCOME - item.EXPENSE),
      0
    );
  }, [filteredData]);

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

  if (initialData.length === 0 && !isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px] text-muted-foreground">
          No financial data found.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{chartDescription}</CardDescription>
          </div>
          {yearOptions.length > 1 && (
            <div className="w-full sm:w-auto sm:min-w-[180px]">
              <Select
                value={selectedYear}
                onValueChange={(value) => setSelectedYear(value)}
              >
                <SelectTrigger aria-label="Select year">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((option) => (
                    <SelectItem
                      key={option.value} // The value itself is now unique
                      value={option.value}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="w-[70%]">
        {filteredData.length === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No data available for the selected year.
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            {/* <ResponsiveContainer> */}
            <RechartsLineChart
              data={filteredData}
              margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => formatMonth(value)}
              />
              <YAxis
                tickFormatter={(value) => `₱${value.toLocaleString()}`}
                axisLine={false}
                tickLine={false}
                width={80}
              />
              <Tooltip
                formatter={(value: number) => [
                  `₱${value.toLocaleString()}`,
                  undefined,
                ]}
                labelFormatter={(label, payload) => {
                  const dataPoint = payload && payload[0] && payload[0].payload;
                  if (dataPoint) {
                    return `${formatMonth(dataPoint.month)} ${dataPoint.year}`;
                  }
                  return formatMonth(Number(label));
                }}
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
            {/* </ResponsiveContainer> */}
          </ChartContainer>
        )}
      </CardContent>
      {showFooter && filteredData.length > 0 && (
        <CardFooter className={"flex-col items-start gap-2 text-sm"}>
          <div className="flex gap-2 font-medium leading-none">
            {trend === Infinity ? (
              <>
                Net income significantly increased (from zero or negative)
                <TrendingUp className="h-4 w-4 text-green-500" />
              </>
            ) : trend === -Infinity ? (
              <>
                Net income significantly decreased (to zero or negative)
                <TrendingDown className="h-4 w-4 text-red-500" />
              </>
            ) : trend > 0 ? (
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
              <>No significant change in net income trend</>
            )}
          </div>
          <div className="leading-none text-muted-foreground">
            Net income for selected period: ₱{netIncome.toLocaleString()}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default TransactionLineChart;
