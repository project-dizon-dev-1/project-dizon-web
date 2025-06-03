import {
  fetchTransactions,
  approveTransaction,
  rejectTransaction, // Add this import for the reject function
} from "@/services/transactionServices";
import { PaginatedDataType } from "@/types/paginatedType";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import useUserContext from "@/hooks/useUserContext";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import useInterObserver from "@/hooks/useIntersectObserver";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import Loading from "@/components/Loading";
import { cn, formatAmount, formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Icon } from "@iconify/react/dist/iconify.js";
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
import { TransactionDataType } from "@/services/transantionTypes";
import ImageLoader from "@/lib/ImageLoader";

const TransactionHistory = () => {
  const { user } = useUserContext();
  const queryClient = useQueryClient();

  // Add approve transaction mutation
  const approveMutation = useMutation({
    mutationFn: approveTransaction,
    onSuccess: () => {
      toast({
        title: "Transaction approved successfully",
      });
      // Refetch transactions data
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: () => {
      toast({
        title: "Error approving transaction",
        variant: "destructive",
      });
    },
  });

  // Add reject transaction mutation
  const rejectMutation = useMutation({
    mutationFn: rejectTransaction,
    onSuccess: () => {
      toast({
        title: "Transaction rejected successfully",
      });
      // Refetch transactions data
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: () => {
      toast({
        title: "Error rejecting transaction",
        variant: "destructive",
      });
    },
  });

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<PaginatedDataType<TransactionDataType>>({
    queryKey: ["transactions"],
    queryFn: async ({ pageParam }) => {
      const page = pageParam as string;
      return await fetchTransactions({
        page,
        pageSize: "10",
      });
    },
    initialPageParam: "1",
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined,
  });

  // Intersection observer for infinite loading
  const { ref } = useInterObserver(fetchNextPage);

  if (isError) {
    return <p>Error fetching transaction data</p>;
  }

  return (
    <div className="h-full overflow-y-scroll no-scrollbar">
      <h1 className="font-bold mb-4">Financial Transactions</h1>
      <Separator className="mb-4 bg-[#BAC1D6]/40" />

      {isLoading ? (
        <Loading />
      ) : (
        <Table>
          <TableCaption>Financial transaction records</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="py-3 px-6 rounded-l-xl text-sm text-nowrap font-bold">
                Category
              </TableHead>
              <TableHead className="py-3 px-6 text-sm text-nowrap font-bold">
                Type
              </TableHead>
              <TableHead className="py-3 px-6 text-sm text-nowrap font-bold">
                Amount
              </TableHead>
              <TableHead className="py-3 px-6 text-sm text-nowrap font-bold">
                Payment Method
              </TableHead>
              <TableHead className="py-3 px-6 text-sm text-nowrap font-bold">
                Date
              </TableHead>
              <TableHead className="py-3 px-6 text-sm text-nowrap font-bold">
                Status
              </TableHead>
              <TableHead className="px-6 rounded-r-lg font-bold">
                Details
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.pages ? (
              data.pages.flatMap((page) =>
                page?.items?.map((transaction, i) => (
                  <TableRow
                    className={cn(
                      i % 2 === 0 ? "h-[45px] rounded-xl" : "bg-white/60"
                    )}
                    key={transaction.id}
                  >
                    <TableCell
                      className={cn(
                        i % 2 === 0 ? "font-medium" : "rounded-l-xl"
                      )}
                    >
                      {transaction.category}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "px-2 py-1 rounded text-white text-xs font-medium",
                          transaction.type === "INCOME"
                            ? "bg-green-500"
                            : "bg-red-500"
                        )}
                      >
                        {transaction.type}
                      </span>
                    </TableCell>
                    <TableCell
                      className={cn(
                        transaction.type === "INCOME"
                          ? "text-green-600 font-semibold"
                          : "text-red-600 font-semibold"
                      )}
                    >
                      {formatAmount(Math.abs(transaction.amount))}
                    </TableCell>
                    <TableCell>{transaction.payment_method}</TableCell>
                    <TableCell>{formatDate(transaction.created_at)}</TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "px-2 py-1 rounded text-xs font-medium",
                          transaction.status === "APPROVED"
                            ? "bg-green-100 text-green-800"
                            : transaction.status === "REJECTED"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        )}
                      >
                        {transaction.status === "APPROVED"
                          ? "Approved"
                          : transaction.status === "REJECTED"
                          ? "Rejected"
                          : "Pending"}
                      </span>
                    </TableCell>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <TableCell
                          className={cn(
                            i % 2 === 0
                              ? "bg-opacity-35 font-medium"
                              : "rounded-r-xl"
                          )}
                        >
                          <div className="w-fit flex items-center gap-1 cursor-pointer">
                            View
                            <Icon
                              icon={"mingcute:arrow-right-up-circle-line"}
                            />
                          </div>
                        </TableCell>
                      </AlertDialogTrigger>
                      <AlertDialogContent className=" max-h-[80%] overflow-y-scroll">
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {transaction.category}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Transaction details
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogBody>
                          <div className="mb-6 px-6 py-4 flex w-full justify-between rounded-xl bg-[#F3F7FD]">
                            <div>
                              <p>Category</p>
                              <p>Amount</p>
                              <p>Payment Method</p>
                              <p>Transaction Date</p>
                              <p>Status</p>
                            </div>
                            <div>
                              <p>{transaction.category}</p>
                              <p
                                className={
                                  transaction.amount >= 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }
                              >
                                {formatAmount(Math.abs(transaction.amount))}
                              </p>
                              <p>{transaction.payment_method}</p>
                              <p>{formatDate(transaction.created_at)}</p>
                              <p>
                                {transaction.status === "APPROVED"
                                  ? "Approved"
                                  : transaction.status === "REJECTED"
                                  ? "Rejected"
                                  : "Pending Approval"}
                              </p>
                            </div>
                          </div>

                          <h2 className="text-default/75 font-bold text-sm">
                            Transaction Details:
                          </h2>
                          <p className="font-medium text-sm mb-4">
                            {transaction.details || "No additional details"}
                          </p>
                          {transaction.proof_url && (
                            <>
                              <h2 className="text-default/75 font-bold text-sm mb-2">
                                Proof of Transaction:
                              </h2>
                              <div className="w-full border rounded-md overflow-hidden mb-4">
                                <ImageLoader
                                  src={transaction.proof_url}
                                  alt="Transaction Proof"
                                  className="w-full h-48 max-h-48 object-contain"
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
                                {transaction.received_by_details
                                  ? `${transaction.received_by_details.user_first_name} ${transaction.received_by_details.user_last_name}`
                                  : "Not specified"}
                              </p>
                              {transaction.created_at && (
                                <p className="text-xs text-gray-500">
                                  {formatDate(transaction.created_at)}
                                </p>
                              )}
                            </div>

                            <div className="flex-1">
                              {transaction.status === "APPROVED" ? (
                                <h3 className="text-green-600 text-sm font-medium">
                                  Approved By:
                                </h3>
                              ) : transaction.status === "REJECTED" ? (
                                <h3 className="text-red-600 text-sm font-medium">
                                  Rejected By:
                                </h3>
                              ) : (
                                <h3 className="text-yellow-600 text-sm font-medium">
                                  Pending Approval
                                </h3>
                              )}
                              {transaction?.response_by_details && (
                                <p>
                                  {transaction?.response_by_details
                                    ?.user_first_name || ""}{" "}
                                  {transaction?.response_by_details
                                    ?.user_last_name || ""}
                                </p>
                              )}

                              {transaction.response_date && (
                                <p className="text-xs text-gray-500">
                                  {formatDate(transaction.response_date)}
                                </p>
                              )}

                              {/* Show action buttons for pending transactions if user is admin and not the creator */}
                              {transaction.status === "PENDING" &&
                                user?.role === "admin" &&
                                !(
                                  transaction.received_by_details
                                    ?.user_first_name ===
                                    user?.user_first_name &&
                                  transaction.received_by_details
                                    ?.user_last_name === user?.user_last_name
                                ) && (
                                  <div className="flex gap-2 mt-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-green-500 text-green-600 hover:bg-green-50"
                                      onClick={() =>
                                        approveMutation.mutate({
                                          transactionId: transaction.id,
                                          userId: user.id,
                                        })
                                      }
                                      disabled={
                                        approveMutation.isPending ||
                                        rejectMutation.isPending
                                      }
                                    >
                                      <Icon
                                        icon="mingcute:check-circle-line"
                                        className="mr-1 h-4 w-4"
                                      />
                                      {approveMutation.isPending
                                        ? "Approving..."
                                        : "Approve"}
                                    </Button>

                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-red-500 text-red-600 hover:bg-red-50"
                                      onClick={() =>
                                        rejectMutation.mutate({
                                          transactionId: transaction.id,
                                          userId: user.id,
                                        })
                                      }
                                      disabled={
                                        approveMutation.isPending ||
                                        rejectMutation.isPending
                                      }
                                    >
                                      <Icon
                                        icon="mingcute:close-circle-line"
                                        className="mr-1 h-4 w-4"
                                      />
                                      {rejectMutation.isPending
                                        ? "Rejecting..."
                                        : "Reject"}
                                    </Button>
                                  </div>
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
                <TableCell colSpan={7} className="text-center">
                  No transaction data available
                </TableCell>
              </TableRow>
            )}
            {hasNextPage && (
              <TableRow ref={ref}>
                <TableCell colSpan={7}>
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

export default TransactionHistory;
