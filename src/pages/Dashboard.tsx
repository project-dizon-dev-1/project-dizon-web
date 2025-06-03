import useUserContext from "@/hooks/useUserContext";
import { getHouseSummary } from "@/services/houseServices";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router";
import {
  fetchPaymentStatus,
  fetchFixedDue,
} from "@/services/subdivisionServices";
import { useEffect, useState } from "react";
import { AlertDialog } from "@radix-ui/react-alert-dialog";
import {
  AlertDialogBody,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatAmount, formatDate, getDaySuffix } from "@/lib/utils";

const Dashboard = () => {
  const { user } = useUserContext();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: houseSummary, isLoading } = useQuery({
    queryKey: ["userHouseSummary", user?.house_id],
    queryFn: async () => getHouseSummary(user?.house_id),
    enabled: !!user?.house_id,
  });

  const { data: fixedDue } = useQuery({
    queryKey: ["userFixedDue"],
    queryFn: fetchFixedDue,
    enabled: !!user,
  });

  const { data: paymentStatusData, isSuccess } = useQuery({
    queryKey: ["paymentStatus"],
    queryFn: fetchPaymentStatus,
  });

  // Check if we should show the dialog based on the last shown timestamp
  const shouldShowDialog = () => {
    const lastShown = localStorage.getItem("paymentDialogLastShown");
    if (!lastShown) return true;

    const lastShownDate = new Date(parseInt(lastShown));
    const currentDate = new Date();

    // Check if it's been at least 24 hours since the dialog was last shown
    const timeDiff = currentDate.getTime() - lastShownDate.getTime();
    const hoursPassed = timeDiff / (1000 * 60 * 60);

    return hoursPassed >= 24; // 24 hours
  };
  useEffect(() => {
    if (
      isSuccess &&
      paymentStatusData.status !== "success" &&
      shouldShowDialog()
    ) {
      setDialogOpen(true);
      // Store the current timestamp when showing the dialog
      localStorage.setItem("paymentDialogLastShown", Date.now().toString());
    }
  }, [isSuccess, paymentStatusData]);

  if (isLoading || !user) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-12 w-3/4 max-w-md" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">
          Welcome, {user?.user_first_name}!
        </h1>
        <p className="text-gray-500">
          Here&apos;s a summary of your household information and payment status
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Household Information Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center gap-2">
              <Icon icon="mingcute:home-4-line" className="h-5 w-5" />
              {houseSummary?.house_family_name} Family
            </CardTitle>
            <CardDescription>
              {houseSummary?.phases?.name}, {houseSummary?.streets?.name}{" "}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-[#DFF0FF6B] p-4 rounded-md">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium text-gray-500">Address</div>
                <div>
                  {houseSummary?.blocks?.name}, {houseSummary?.lots?.name}
                </div>

                <div className="font-medium text-gray-500">
                  Point of Contact
                </div>
                <div>
                  {houseSummary?.house_main_poc_user?.user_first_name}{" "}
                  {houseSummary?.house_main_poc_user?.user_last_name}
                </div>

                <div className="font-medium text-gray-500">Last Payment</div>
                <div>
                  {houseSummary?.house_latest_payment ? (
                    formatDate(houseSummary.house_latest_payment)
                  ) : (
                    <span className="text-amber-600">No recent payment</span>
                  )}
                </div>

                <div className="font-medium text-gray-500">Last Amount</div>
                <div>
                  {formatAmount(houseSummary?.house_latest_payment_amount ?? 0)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Summary Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl flex items-center gap-2">
                <Icon icon="mingcute:bill-line" className="h-5 w-5" />
                Payment Summary
              </CardTitle>
              <Badge
                variant={"outline"}
                className={
                  houseSummary?.paymentStatus === "Paid"
                    ? "bg-green-100 text-green-800"
                    : houseSummary?.paymentStatus === "Partially Paid"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-red-100 text-red-800"
                }
              >
                {houseSummary?.paymentStatus}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 bg-[#DFF0FF6B] p-4 rounded-md">
              <div className="flex justify-between items-center">
                <span className="font-medium">Current Month Due</span>
                <span>{formatAmount(houseSummary?.currentMonthDue ?? 0)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium">Previous Balance</span>
                <span
                  className={
                    houseSummary?.house_arrears &&
                    houseSummary?.house_arrears > 0
                      ? "text-red-600"
                      : ""
                  }
                >
                  {formatAmount(houseSummary?.house_arrears ?? 0)}
                </span>
              </div>

              <Separator />

              <div className="flex justify-between items-center font-bold">
                <span>Total Outstanding</span>
                <span
                  className={
                    houseSummary?.totalOutstanding &&
                    houseSummary?.totalOutstanding > 0
                      ? "text-red-600"
                      : "text-green-600"
                  }
                >
                  {formatAmount(houseSummary?.totalOutstanding ?? 0)}
                </span>
              </div>

              <div className="flex justify-between items-center pt-3">
                <span className="text-sm text-gray-500">Monthly Due Date</span>
                <span className="text-sm">
                  {fixedDue?.due_date
                    ? `Every ${fixedDue.due_date}${getDaySuffix(
                        fixedDue.due_date
                      )} of the month`
                    : "Not set"}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Grace Period</span>
                <span>{fixedDue?.grace_period ?? 0} days</span>
              </div>
            </div>

            <div className="text-center">
              <Link
                to="/payment-history"
                className="text-sm text-blue-600 hover:underline"
              >
                View Payment History →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Payment Status Message</AlertDialogTitle>
            <AlertDialogDescription></AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogBody>
            <div className="flex flex-col items-center">
              {paymentStatusData?.status === "warning" && (
                <Icon
                  icon="mingcute:warning-line"
                  className="text-orange-500 h-10 w-10 mb-2"
                />
              )}
              {paymentStatusData?.status === "danger" && (
                <Icon
                  icon="mingcute:warning-line"
                  className="text-red-500 h-10 w-10 mb-2"
                />
              )}
              <p className="text-gray-700 text-sm">
                {paymentStatusData?.message}
              </p>
            </div>
          </AlertDialogBody>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
