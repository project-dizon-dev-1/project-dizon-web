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
import { cn, formatAmount, formatDate } from "@/lib/utils";
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
import ImageLoader from "@/lib/ImageLoader";

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
    enabled: !!user?.house_id,
  });

  const { ref } = useInterObserver(fetchNextPage);

  console.log("Payment History Data:", data);

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
                      {formatDate(payment.created_at)}
                    </TableCell>
                    <TableCell>
                      {payment.date && formatDate(payment.date)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatAmount(payment.amount ?? 0)}
                    </TableCell>
                    <TableCell>
                      {(() => {
                        if (!payment.created_at) {
                          return (
                            <Badge
                              variant={"outline"}
                              className="bg-red-100 text-red-800"
                            >
                              Rejected
                            </Badge>
                          );
                        }

                        const latestFinanceLog = payment.finance_log;

                        if (latestFinanceLog?.status === "PENDING") {
                          return (
                            <Badge
                              variant={"outline"}
                              className="bg-yellow-100 text-yellow-800"
                            >
                              Pending
                            </Badge>
                          );
                        }

                        if (latestFinanceLog?.status === "APPROVED") {
                          return (
                            <Badge
                              variant={"outline"}
                              className="bg-green-100 text-green-800"
                            >
                              Paid
                            </Badge>
                          );
                        }

                        if (latestFinanceLog?.status === "REJECTED") {
                          return (
                            <Badge
                              variant={"outline"}
                              className="bg-red-100 text-red-800"
                            >
                              Rejected
                            </Badge>
                          );
                        }

                        if (!latestFinanceLog && payment.created_at) {
                          return (
                            <Badge
                              variant={"outline"}
                              className="bg-green-100 text-green-800"
                            >
                              Paid
                            </Badge>
                          );
                        }

                        return (
                          <Badge
                            variant={"outline"}
                            className="bg-red-100 text-red-800"
                          >
                            Rejected
                          </Badge>
                        );
                      })()}
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
                            {payment.date && formatDate(payment?.date)}
                            payment
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogBody>
                          <div className="mb-6 px-6 py-4 flex w-full justify-between rounded-xl bg-[#F3F7FD]">
                            <div className="flex flex-col gap-2">
                              <p className="font-medium">Billing Month:</p>
                              <p className="font-medium">Date Paid:</p>
                              <p className="font-medium">Amount:</p>
                              <p className="font-medium">Payment Status:</p>
                            </div>
                            <div className="flex flex-col gap-2 text-right">
                              <p>{payment.date && formatDate(payment?.date)}</p>
                              <p>{formatDate(payment.created_at)}</p>
                              <p className="font-medium">
                                {formatAmount(payment.amount ?? 0)}
                              </p>
                              {(() => {
                                if (!payment.created_at) {
                                  return (
                                    <Badge
                                      variant={"outline"}
                                      className="bg-red-100 text-red-800 w-fit"
                                    >
                                      Rejected
                                    </Badge>
                                  );
                                }

                                const latestFinanceLog = payment.finance_log;

                                if (latestFinanceLog?.status === "PENDING") {
                                  return <p>Pending</p>;
                                }

                                if (latestFinanceLog?.status === "APPROVED") {
                                  return <p>Paid</p>;
                                }

                                if (latestFinanceLog?.status === "REJECTED") {
                                  return <p>Rejected</p>;
                                }

                                if (!latestFinanceLog && payment.created_at) {
                                  return (
                                    <Badge
                                      variant={"outline"}
                                      className="bg-green-100 text-green-800 w-fit"
                                    >
                                      Paid
                                    </Badge>
                                  );
                                }

                                return (
                                  <Badge
                                    variant={"outline"}
                                    className="bg-red-100 text-red-800 w-fit"
                                  >
                                    Rejected
                                  </Badge>
                                );
                              })()}
                            </div>
                          </div>

                          {payment.details && (
                            <div className="mb-4">
                              <h2 className="text-default/75 font-bold text-sm">
                                Additional Details:
                              </h2>
                              <p className="font-medium text-sm">
                                {payment.details}
                              </p>
                            </div>
                          )}

                          {payment.proof_url && (
                            <div className="mb-4">
                              <h2 className="text-default/75 font-bold text-sm mb-2">
                                Payment Proof:
                              </h2>
                              <div className="w-full border rounded-md overflow-hidden">
                                <ImageLoader
                                  src={payment.proof_url}
                                  alt="Payment Proof"
                                  className="w-full h-auto max-h-48 object-contain"
                                />
                              </div>
                            </div>
                          )}

                          <Separator className="my-6" />

                          <div className="flex ">
                            <div className="flex-1">
                              <h3 className="text-blue-600 text-sm font-medium">
                                Received By:
                              </h3>
                              <p className="text-sm font-medium">
                                {payment?.receiver?.user_first_name}{" "}
                                {payment?.receiver?.user_last_name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatDate(payment.created_at)}
                              </p>
                            </div>

                            <div className="flex-1">
                              {(() => {
                                const latestFinanceLog = payment.finance_log;

                                if (latestFinanceLog?.status === "PENDING") {
                                  return (
                                    <div>
                                      <h3 className="text-yellow-600 text-sm font-medium">
                                        Pending Approval
                                      </h3>
                                    </div>
                                  );
                                }

                                if (latestFinanceLog?.status === "APPROVED") {
                                  return (
                                    <div className="flex-1">
                                      <h3 className="text-green-600 text-sm font-medium">
                                        Approved By:
                                      </h3>
                                      <p className="text-sm font-medium">
                                        {
                                          latestFinanceLog.response_by_details
                                            ?.user_first_name
                                        }{" "}
                                        {
                                          latestFinanceLog.response_by_details
                                            ?.user_last_name
                                        }
                                      </p>
                                      {latestFinanceLog?.response_date && (
                                        <p className="text-xs text-gray-500">
                                          {formatDate(
                                            latestFinanceLog.response_date
                                          )}
                                        </p>
                                      )}
                                    </div>
                                  );
                                }

                                if (latestFinanceLog?.status === "REJECTED") {
                                  return (
                                    <div>
                                      <h3 className="text-red-600 text-sm font-medium">
                                        Rejected By:
                                      </h3>
                                      <p className="text-sm font-medium">
                                        {
                                          latestFinanceLog.response_by_details
                                            ?.user_first_name
                                        }{" "}
                                        {
                                          latestFinanceLog.response_by_details
                                            ?.user_last_name
                                        }
                                      </p>
                                    </div>
                                  );
                                }

                                if (!latestFinanceLog && payment.created_at) {
                                  return (
                                    <div>
                                      <h3 className="text-green-600 text-sm font-medium">
                                        Auto-Approved
                                      </h3>
                                    </div>
                                  );
                                }

                                return null;
                              })()}
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
