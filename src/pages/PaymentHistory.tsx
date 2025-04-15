import useUserContext from "@/hooks/useUserContext";
import { fetchDueLogsByHouse } from "@/services/dueServices";
import { useInfiniteQuery } from "@tanstack/react-query";
import Loading from "@/components/Loading";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import useInterObserver from "@/hooks/useIntersectObserver";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PaginatedDataType } from "@/types/paginatedType";
import { DueLog } from "@/types/DueTypes";

const PaymentHistory = () => {
  const { user } = useUserContext();

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<PaginatedDataType<DueLog>>({
    queryKey: ["userPaymentHistory", user?.house_id],
    queryFn: async ({ pageParam }) => {
      const page = pageParam as string;

      try {
        const response = await fetchDueLogsByHouse({
          houseId: user?.house_id,
          page,
          pageSize: "10",
        });
        return response;
      } catch (err) {
        console.error("Error fetching payment history:", err);
        throw err;
      }
    },
    initialPageParam: "1",
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.hasNextPage) {
        return undefined;
      }
      return lastPage.currentPage + 1;
    },
    enabled: !!user,
  });

  const { ref } = useInterObserver(fetchNextPage);

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <Icon
          icon="mingcute:warning-fill"
          className="h-16 w-16 text-amber-500 mb-4"
        />
        <h2 className="text-xl font-bold mb-2">
          Error Loading Payment History
        </h2>
        <p className="text-gray-600 mb-4">
          Unable to fetch your payment records.
        </p>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          onClick={() => window.location.reload()}
        >
          <Icon icon="mingcute:refresh-line" className="h-4 w-4" />
          Retry
        </button>
      </div>
    );
  }

  if (isLoading || !user) {
    return <Loading />;
  }

  const noPaymentsMessage = (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-gray-300 rounded-lg mt-8">
      <Icon
        icon="mingcute:bill-line"
        className="h-16 w-16 text-gray-400 mb-4"
      />
      <h3 className="text-xl font-medium">No Payment Records Found</h3>
      <p className="text-gray-500 max-w-md mx-auto mt-2">
        We don&apos;t have any payment records for your household yet.
      </p>
    </div>
  );
  return (
    <div className="h-full overflow-y-scroll no-scrollbar">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Payment History</h1>
        <p className="text-gray-500">
          View your household&apos;s payment records and transaction details
        </p>
      </div>

      <Separator className="mb-8 mt-3 bg-[#BAC1D6]/40" />

      {data?.pages && data?.pages[0]?.items?.length === 0 ? (
        noPaymentsMessage
      ) : (
        <Table>
          <TableCaption>A history of your monthly payments</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="py-3 px-6 rounded-l-xl text-sm text-nowrap font-bold">
                Date Paid
              </TableHead>
              <TableHead className="py-3 px-6 text-sm text-nowrap font-bold">
                Billing Month
              </TableHead>
              <TableHead className="py-3 px-6 text-sm text-nowrap font-bold">
                Amount
              </TableHead>
              <TableHead className="py-3 px-6 text-sm text-nowrap font-bold">
                Payment Status
              </TableHead>

              <TableHead className="px-6 rounded-r-lg font-bold">
                Details
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.pages ? (
              data.pages.flatMap((page) =>
                page?.items?.map((payment, i) => (
                  <TableRow
                    className={cn(
                      i % 2 === 0 ? "h-[45px] rounded-xl" : "bg-white/60"
                    )}
                    key={payment.id}
                  >
                    <TableCell
                      className={cn(
                        i % 2 === 0 ? "font-medium" : "rounded-l-xl"
                      )}
                    >
                      {new Date(payment.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {payment.date &&
                        new Date(payment.date).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                    </TableCell>
                    <TableCell className="font-medium">
                      ₱{payment.amount?.toLocaleString("en-PH") ?? 0}
                    </TableCell>
                    <TableCell>
                      {payment.amount_status === "Fully_Paid" ? (
                        <Badge className="bg-green-100 text-green-800 shadow-none hover:bg-green-100">
                          Fully Paid
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800 shadow-none hover:bg-yellow-100">
                          Partially Paid
                        </Badge>
                      )}
                    </TableCell>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <TableCell
                          className={cn(
                            i % 2 === 0 ? "font-medium" : "rounded-r-xl"
                          )}
                        >
                          <div className="w-fit flex items-center gap-1 cursor-pointer">
                            View
                            <Icon icon="mingcute:arrow-right-up-circle-line" />
                          </div>
                        </TableCell>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Payment Details</AlertDialogTitle>
                          <AlertDialogDescription>
                            Transaction information for your{" "}
                            {payment.date &&
                              new Date(payment.date).toLocaleDateString(
                                "en-US",
                                {
                                  month: "long",
                                  year: "numeric",
                                }
                              )}{" "}
                            payment
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogBody>
                          <div className="mb-6 px-6 py-4 flex w-full justify-between rounded-xl bg-[#F3F7FD]">
                            <div>
                              <p>Billing Month</p>
                              <p>Date Paid</p>
                              <p>Amount</p>
                              <p>Payment Status</p>
                            </div>
                            <div>
                              <p>
                                {payment.date &&
                                  new Date(payment.date).toLocaleDateString(
                                    "en-PH",
                                    {
                                      month: "long",
                                      year: "numeric",
                                    }
                                  )}
                              </p>
                              <p>
                                {new Date(
                                  payment.created_at
                                ).toLocaleDateString()}
                              </p>
                              <p className="font-medium">
                                ₱{payment.amount?.toLocaleString() ?? 0}
                              </p>
                              {payment.amount_status === "Fully_Paid" ? (
                                <Badge className="bg-green-100 text-green-800 shadow-none hover:bg-green-100">
                                  Fully Paid
                                </Badge>
                              ) : (
                                <Badge className="bg-yellow-100 text-yellow-800 shadow-none hover:bg-yellow-100">
                                  Partially Paid
                                </Badge>
                              )}
                            </div>
                          </div>

                          {payment.details && (
                            <>
                              <h2 className="text-default/75 font-bold text-sm">
                                Additional Details:
                              </h2>
                              <p className="font-medium text-sm mb-4">
                                {payment.details}
                              </p>
                            </>
                          )}

                          {payment.proof_url && (
                            <>
                              <h2 className="text-default/75 font-bold text-sm mb-2">
                                Payment Proof:
                              </h2>
                              <div className="w-full border rounded-md overflow-hidden mb-4">
                                <img
                                  src={payment.proof_url}
                                  alt="Payment Proof"
                                  className="w-full h-auto max-h-48 object-contain"
                                />
                              </div>
                            </>
                          )}

                          <Separator className="my-6" />

                          <div className="flex">
                            <div className="flex-1">
                              <h3 className="text-blue-600 text-sm font-medium">
                                Received By:
                              </h3>
                              <p className="text-sm font-medium">
                                {payment?.receiver?.user_first_name}{" "}
                                {payment?.receiver?.user_last_name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(payment.created_at).toLocaleString()}
                              </p>
                            </div>

                            <div className="flex-1">
                              <h3
                                className={
                                  payment.confirmed_by_user
                                    ? "text-green-600 text-sm font-medium"
                                    : "text-yellow-600 text-sm font-medium"
                                }
                              >
                                {payment.confirmed_by_user
                                  ? "Confirmed By:"
                                  : "Pending Confirmation"}
                              </h3>
                              {payment.confirmed_by_user && (
                                <>
                                  <p className="text-sm font-medium">
                                    {payment.confirmed_by_user?.user_first_name}{" "}
                                    {payment.confirmed_by_user?.user_last_name}
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                        </AlertDialogBody>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Close</AlertDialogCancel>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableRow>
                ))
              )
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No payment history available
                </TableCell>
              </TableRow>
            )}
            {hasNextPage && (
              <TableRow ref={ref}>
                <TableCell colSpan={6}>
                  {isFetchingNextPage && (
                    <Skeleton className="h-10 w-full rounded-xl" />
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default PaymentHistory;
