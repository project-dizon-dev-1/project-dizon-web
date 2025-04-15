import ConfigureCollectionForm from "@/components/Collection/ConfigureCollectionForm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { getHousesSummary } from "@/services/houseServices";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { Separator } from "@/components/ui/separator";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { HousesSummary } from "@/types/HouseTypes";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { fetchUserFixedDue } from "@/services/subdivisionServices";

const Collection = () => {
  const { data, isError, isLoading } = useQuery<HousesSummary>({
    queryKey: ["houseSummary"],
    queryFn: getHousesSummary,
  });

  const {
    data: fixedDue,
    isLoading: DueLoading,
    isError: dueError,
  } = useQuery({
    queryKey: ["userFixedDue"],
    queryFn: fetchUserFixedDue,
  });

  const navigate = useNavigate();

  const handleCardClick = (phase: string) => {
    navigate(`/collection/${phase}`, { replace: true });
  };

  if (isLoading || DueLoading) {
    return (
      <div className="w-full h-full p-6 space-y-6">
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-full max-w-md" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-6">
                <Skeleton className="h-40 w-full rounded-md" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError || dueError) {
    return (
      <div className="flex h-full w-full items-center justify-center p-6">
        <Card className="w-full max-w-md p-6">
          <div className="flex flex-col items-center text-center">
            <Icon
              icon="mingcute:warning-fill"
              className="h-12 w-12 text-amber-500 mb-4"
            />
            <CardTitle className="text-xl mb-2">
              Error Loading Collection Data
            </CardTitle>
            <CardDescription className="mb-6">
              Unable to retrieve collection information. Please try again later.
            </CardDescription>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Icon icon="mingcute:refresh-line" className="mr-2 h-4 w-4" />
              Retry
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto no-scrollbar p-2">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Collection Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of monthly dues collection and payment status across phases
        </p>
      </div>

      {data && (
        <Card className="mb-6 bg-gradient-to-br from-blue-100/90 via-indigo-200/50 to-purple-200/90 ">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Icon
                icon="mingcute:chart-pie-line"
                className="h-5 w-5 text-blue-600"
              />
              Overall Collection Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Residents
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">
                    {data.totalResidents}
                  </span>
                  <div className="flex items-center text-sm">
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800 mr-1"
                    >
                      {data.totalPaidResidents} Paid
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-amber-100 text-amber-800"
                    >
                      {data.totalUnpaidResidents} Unpaid
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Collected Dues
                </p>
                <p className="text-2xl font-bold text-green-600">
                  ₱{data.totalPaidAmount.toLocaleString("en-PH")}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Pending Dues
                </p>
                <p className="text-2xl font-bold text-amber-600">
                  ₱{data.totalUnpaidAmount.toLocaleString("en-PH")}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Expected
                </p>
                <p className="text-2xl font-bold">
                  ₱{data.totalExpectedAmount.toLocaleString("en-PH")}
                </p>
                <Progress
                  value={data.percentageCollected}
                  className="h-2"
                  indicatorClassName="bg-green-500"
                />
                <p className="text-xs text-muted-foreground">
                  {data.percentageCollected.toFixed(1)}% collected
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Collection Amount
                </p>
                <p className=" font-bold text-2xl">
                  ₱{fixedDue?.amount?.toLocaleString("en-PH")}
                </p>
                <p className="text-sm text-muted-foreground">
                  Every {fixedDue?.due_date} of the month
                </p>
                <p className=" text-xs text-muted-foreground">
                  Grace period: {fixedDue?.grace_period} days
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Phase Summary</h2>
        <ConfigureCollectionForm
          amount={fixedDue?.amount}
          due_date={fixedDue?.due_date}
          grace_period={fixedDue?.grace_period}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {data &&
          data.summaryPerPhase &&
          data.summaryPerPhase.length > 0 &&
          data.summaryPerPhase.map((phase) => {
            // We now have paidResidentsPercentage directly from the backend

            return (
              <Card
                onClick={() => handleCardClick(phase.phase)}
                className="cursor-pointer"
                key={phase.phase}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <span>{phase.phaseName}</span>
                      <Badge
                        className={cn(
                          "ml-2 ",
                          phase.paidResidentsPercentage * 100 >= 75
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : phase.paidResidentsPercentage * 100 >= 50
                            ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        )}
                      >
                        {(phase.paidResidentsPercentage * 100).toFixed(0)}%
                        Collected
                      </Badge>
                    </CardTitle>
                    <Icon
                      icon="mingcute:arrow-right-circle-line"
                      className="h-5 w-5 text-muted-foreground"
                    />
                  </div>
                  <Separator className="my-2" />
                </CardHeader>
                <CardContent>
                  {/* Resident stats */}
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        Residents
                      </span>
                      <span className="text-sm font-medium">
                        {phase.totalResidents} total
                      </span>
                    </div>

                    {/* Progress bar using shadcn Progress */}
                    <Progress
                      value={phase.paidResidentsPercentage * 100}
                      className="h-2.5 mb-2"
                      indicatorClassName="bg-green-500"
                    />

                    <div className="flex justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <Icon
                          icon="mingcute:check-circle-fill"
                          className="h-3.5 w-3.5 text-green-600"
                        />
                        <span>
                          {phase.paidResidentsCount} paid (
                          {(phase.paidResidentsPercentage * 100).toFixed(0)}%)
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon
                          icon="mingcute:close-circle-fill"
                          className="h-3.5 w-3.5 text-amber-600"
                        />
                        <span>
                          {phase.unpaidResidentsCount} unpaid (
                          {(phase.unpaidResidentsPercentage * 100).toFixed(0)}%)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3  rounded-lg p-3 bg-slate-50">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">Monthly Due</p>
                      <p className="text-sm font-semibold">
                        ₱{phase.dueAmountPerResident.toLocaleString("en-PH")}
                      </p>
                    </div>
                    <Separator className="my-1" />
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">Collected</p>
                      <p className="text-sm font-semibold text-green-600">
                        ₱{phase.totalPaidAmount.toLocaleString("en-PH")}
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">Pending</p>
                      <p className="text-sm font-semibold text-amber-600">
                        ₱{phase.totalUnpaidAmount.toLocaleString("en-PH")}
                      </p>
                    </div>
                    <Separator className="my-1" />
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">Expected Total</p>
                      <p className="text-sm font-semibold">
                        ₱{phase.totalExpectedAmount.toLocaleString("en-PH")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>
    </div>
  );
};

export default Collection;
