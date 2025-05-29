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
import { Button } from "@/components/ui/button";
import TransactionDialog from "@/components/Finance/TransactionDialog";
import { Icon } from "@iconify/react/dist/iconify.js";
import { formatAmount } from "@/lib/utils";

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
  } = useQuery({
    queryKey: ["financeChartData"],
    queryFn: fetchSubdivisionDashboard,
  });

  if (summaryError) {
    return <p>error fetching dues</p>;
  }
  return (
    <div className="p-4 overflow-y-auto no-scrollbar">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Financial Overview</h1>

        <TransactionDialog>
          <Button className="flex items-center gap-2">
            <Icon icon="mingcute:plus-circle-line" className="h-4 w-4" />
            Record Transaction
          </Button>
        </TransactionDialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Financial Summary Cards */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Income</CardTitle>
            <CardDescription className="text-sm">
              Total income all year round
            </CardDescription>
          </CardHeader>
          <CardContent className="">
            {summaryLoading ? (
              <div className="h-8 bg-gray-200 animate-pulse rounded-md"></div>
            ) : (
              <div className="text-2xl font-bold text-blue-500">
                {formatAmount(summaryData?.total_income || 0)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Expense</CardTitle>
            <CardDescription className="text-sm">
              Total expenses all year round
            </CardDescription>
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <div className="h-8 bg-gray-200 animate-pulse rounded-md"></div>
            ) : (
              <div className="text-2xl font-bold text-red-500">
                {formatAmount(summaryData?.total_expense || 0)}
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
                {formatAmount(summaryData?.net_total || 0)}
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
    </div>
  );
};

export default FinanceOverview;
