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
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams } from "react-router";
import { cn } from "@/lib/utils";

const PaymentHistory = () => {
  const {
    data,
    isError,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<PaginatedDataType<DueLog>>({
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

  const [searchParams, setSearchParams] = useSearchParams();

  const updateParams = (key: string, value: string) => {
    searchParams.set(key, value);
    setSearchParams(searchParams);
  };

  const { ref } = useInterObserver(fetchNextPage);

  if (isError) {
    return <p>Error fetching dues</p>;
  }

  return (
    <div className="  h-full overflow-y-scroll no-scrollbar">
      <div className="flex items-center gap-3">
        <Input
          className="w-[504px] rounded-xl bg-white h-[42px]"
          placeholder="Search Household Units"
        />
        <Select
          value={searchParams.get("phase") || ""}
          onValueChange={(value) => updateParams("phase", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue
              placeholder={searchParams.get("phase") || "All Phases"}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Phase 1">Phase 1</SelectItem>
            <SelectItem value="Phase 2">Phase 2</SelectItem>
            <SelectItem value="Phase 3">Phase 3</SelectItem>
            <SelectItem value="Phase 4">Phase 4</SelectItem>
            <SelectItem value="Phase 5">Phase 5</SelectItem>
            <SelectItem value="Phase 6">Phase 6</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={searchParams.get("bill-month") || ""}
          onValueChange={(value) => updateParams("bill-month", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue
              placeholder={searchParams.get("bill-month") || "All months"}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Phase 1">Phase 1</SelectItem>
            <SelectItem value="Phase 2">Phase 2</SelectItem>
            <SelectItem value="Phase 3">Phase 3</SelectItem>
            <SelectItem value="Phase 4">Phase 4</SelectItem>
            <SelectItem value="Phase 5">Phase 5</SelectItem>
            <SelectItem value="Phase 6">Phase 6</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={searchParams.get("status") || ""}
          onValueChange={(value) => updateParams("phase", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue
              placeholder={searchParams.get("status") || "All Status"}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Phase 1">Phase 1</SelectItem>
            <SelectItem value="Phase 2">Phase 2</SelectItem>
            <SelectItem value="Phase 3">Phase 3</SelectItem>
            <SelectItem value="Phase 4">Phase 4</SelectItem>
            <SelectItem value="Phase 5">Phase 5</SelectItem>
            <SelectItem value="Phase 6">Phase 6</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Separator className="mb-8 mt-3 " />
      <h1 className=" font-bold mb-3">Payment History</h1>
      {isLoading ? (
        <Loading />
      ) : (
        <Table className=" font-medium">
          <TableCaption>A list of your history of payments.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className=" py-3 px-6 rounded-l-xl text-sm text-nowrap font-bold">
                Family Name
              </TableHead>
              <TableHead className=" py-3 px-6 text-sm text-nowrap font-bold">
                Address
              </TableHead>
              <TableHead className=" py-3 px-6 text-sm text-nowrap font-bold">
                Date Paid
              </TableHead>
              <TableHead className=" py-3 px-6 text-sm text-nowrap font-bold">
                Billing Month
              </TableHead>
              <TableHead className=" py-3 px-6 text-sm text-nowrap font-bold">
                Details
              </TableHead>
              <TableHead className=" py-3 px-6 text-sm text-nowrap font-bold">
                Amount
              </TableHead>
              <TableHead className=" py-3 px-6  text-sm text-nowrap font-bold">
                Bill Status
              </TableHead>
              <TableHead className="px-6 rounded-r-lg  font-bold">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.pages ? (
              data?.pages.flatMap((page) =>
                page.items.map((due, i) => (
                  <TableRow
                    className={cn("h-[45px]",
                      i % 2 === 0 ? "   rounded-xl" : "bg-white/60"
                    )}
                    key={due.id}
                  >
                    <TableCell
                      className={cn(
                        i % 2 === 0 ? " font-medium" : " rounded-l-xl"
                      )}
                      // className="font-medium"
                    >
                      {due.house_list?.house_family_name}
                    </TableCell>
                    <TableCell className="text-nowrap">
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
                    <TableCell>
                      {due.amount?.toLocaleString("en-PH") ?? 0} ₱
                    </TableCell>
                    <TableCell>{due.confirmed_by}</TableCell>
                    <TableCell
                      className={cn(
                        i % 2 === 0
                          ? " font-medium"
                          : " rounded-r-xl"
                      )}
                    >
                      {due.confirmed_by}
                    </TableCell>
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
