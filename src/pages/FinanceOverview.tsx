import {
  fetchSubdivisionDashboard,
  fetchSubdivisionSummary,
} from "@/services/subdivisionServices";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TransactionLineChart from "@/components/LineChart";
import { FinancialChartData } from "@/components/BarChart";

const FinanceOverview = () => {
  const {
    data: summaryData,
    isLoading: summaryLoading,
    error: summaryError,
  } = useQuery({
    queryKey: ["financeSummary"],
    queryFn: fetchSubdivisionSummary,
  });

  const {
    data: chartData,
    isLoading: chartLoading,
    error: chartError,
  } = useQuery<FinancialChartData[]>({
    queryKey: ["financeChartData"],
    queryFn: fetchSubdivisionDashboard,
  });

  if (summaryError) {
    return <p>error fetching dues</p>;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 overflow-y-scroll no-scrollbar">
      {/* Financial Summary Cards */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Total Income</CardTitle>
          <CardDescription className="text-sm">
            Total income for the current month
          </CardDescription>
        </CardHeader>
        <CardContent>
          {summaryLoading ? (
            <div className="h-8 bg-gray-200 animate-pulse rounded-md"></div>
          ) : (
            <div className="text-2xl font-bold text-blue-500">
              ₱{summaryData?.total_income?.toLocaleString() || 0}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Total Expense</CardTitle>
          <CardDescription className="text-sm">
            Total expenses for the current month
          </CardDescription>
        </CardHeader>
        <CardContent>
          {summaryLoading ? (
            <div className="h-8 bg-gray-200 animate-pulse rounded-md"></div>
          ) : (
            <div className="text-2xl font-bold text-red-500">
              ₱{summaryData?.total_expense?.toLocaleString() || 0}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Net Income</CardTitle>
        </CardHeader>
        <CardContent>
          {summaryLoading ? (
            <div className="h-8 bg-gray-200 animate-pulse rounded-md"></div>
          ) : (
            <div
              className={`text-2xl font-bold ${
                (summaryData?.net_total || 0) >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              ₱{summaryData?.net_total?.toLocaleString() || 0}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bar Chart for Monthly Data */}
      <div className="col-span-1 md:col-span-3">
        <TransactionLineChart
          data={chartData}
          isLoading={chartLoading}
          error={chartError as Error}
          title="Monthly Financial Overview"
          description="Income vs Expenses"
        />
      </div>
    </div>
  );
};

export default FinanceOverview;
