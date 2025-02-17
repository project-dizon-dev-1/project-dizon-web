import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchDueLogs } from "@/services/DuesServices";
import Loading from "@/components/Loading";
import { DueLog } from "@/types/DueTypes";
import { PaginatedDataType } from "@/types/paginatedType";
import useInterObserver from "@/hooks/useIntersectObserver";
import { Skeleton } from "@/components/ui/skeleton";

const PaymentHistory = () => {
  const {
    data,
    isError,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<PaginatedDataType<DueLog>, Error>({
    queryKey: ["paymentHistory"],
    queryFn: async ({ pageParam }) => {
      const page = pageParam as string;
      const response = await fetchDueLogs({ page, pageSize: "20" });
      return response;
    },
    initialPageParam: "1",
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.hasNextPage) {
        return undefined;
      }
      return lastPage.currentPage + 1;
    },
  });

  const { ref } = useInterObserver(fetchNextPage);

  if (isError) {
    return <p>Error fetching dues</p>;
  }


  return (
    <div className="p-4 w-full h-full ">
      <h1 className="font-bold text-3xl mb-5">Payment History</h1>
      {isLoading ? (
        <Loading />
      ) : (
        <Table>
          <TableCaption>A list of your history of payments.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Family Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Date Paid</TableHead>
              <TableHead>Payment for the month of</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment Confirmed by</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.pages ? (
              data?.pages.flatMap((page) =>
                page.items.map((due) => (
                  <TableRow key={due.id}>
                    <TableCell className="font-medium">
                      {due.house_list?.house_family_name}
                    </TableCell>
                    <TableCell>
                      {`${due.house_list?.house_phase} ${due.house_list?.house_street} Street Block ${due.house_list?.house_block} Lot ${due.house_list?.house_lot}`}
                    </TableCell>
                    <TableCell>
                      {new Date(due.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {due.date &&
                        new Date(due.date).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                    </TableCell>
                    <TableCell>{due.details}</TableCell>
                    <TableCell>{due.amount?.toLocaleString("en-PH")??0}  ₱</TableCell>
                    <TableCell>{due.confirmed_by}</TableCell>
                  </TableRow>
                ))
              )
            ) : (
              <TableRow>
                <TableCell colSpan={8}>No data available</TableCell>
              </TableRow>
            )}
            {hasNextPage && (
              <TableRow ref={ref}>
                <TableCell colSpan={8}>
                  {isFetchingNextPage && (
                    <Skeleton className="h-10 w-full rounded-xl" />
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
      {/* Skeleton loader for infinite scroll */}
    </div>
  );
};

export default PaymentHistory;
