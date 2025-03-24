import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogBody,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";
import { Icon } from "@iconify/react/dist/iconify.js";

const PaymentHistory = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(
    searchParams.get("query") || ""
  );
  const debouncedSearch = useDebounce(searchInput, 500);

  const {
    data,
    isError,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<PaginatedDataType<DueLog>>({
    queryKey: [
      "paymentHistory",
      searchParams.get("bill-month"),
      searchParams.get("status"),
      searchParams.get("phase"),
      searchParams.get("query"),
    ],
    queryFn: async ({ pageParam }) => {
      const page = pageParam as string;
      const response = await fetchDueLogs({
        month: searchParams.get("bill-month"),
        status: searchParams.get("status"),
        query: searchParams.get("query"),
        phase: searchParams.get("phase"),
        page,
        pageSize: "20",
      });
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

  // Update search params when debounced search value changes
  useEffect(() => {
    if (debouncedSearch) {
      searchParams.set("query", debouncedSearch);
    } else {
      searchParams.delete("query");
    }
    setSearchParams(searchParams);
  }, [debouncedSearch]);

  const clearFilters = () => {
    setSearchParams({});
    setSearchInput("");
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const months = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const date = new Date(2024, i, 1);
      return {
        value: (i + 1).toString(), // Use month index as value (1-12)
        label: date.toLocaleString("default", { month: "long" }), // Full month name
      };
    });
  }, []);

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
          className=" w-[428px] rounded-xl bg-white h-[42px]"
          placeholder="Search Household Units"
          value={searchInput}
          onChange={handleSearchChange}
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
            <SelectItem value="1">Phase 1</SelectItem>
            <SelectItem value="2">Phase 2</SelectItem>
            <SelectItem value="3">Phase 3</SelectItem>
            <SelectItem value="4">Phase 4</SelectItem>
            <SelectItem value="5">Phase 5</SelectItem>
            <SelectItem value="6">Phase 6</SelectItem>
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
            <SelectItem value="all">All months</SelectItem>
            {months.map((month) => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={searchParams.get("status") || ""}
          onValueChange={(value) => updateParams("status", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue
              placeholder={searchParams.get("status") || "All Status"}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Fully_Paid">Fully Paid</SelectItem>
            <SelectItem value="Partially_Paid">Partially Paid</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={clearFilters} variant={"ghost"}>
          Clear Filters
        </Button>
      </div>
      <Separator className="mb-8 mt-3 bg-[#BAC1D6]/40" />
      <h1 className=" font-bold">Household Units</h1>
      {isLoading ? (
        <Loading />
      ) : (
        <Table>
          <TableCaption>A list of payment history.</TableCaption>
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
              {/* <TableHead className=" py-3 px-6 text-sm text-nowrap font-bold">
                Details
              </TableHead> */}
              <TableHead className=" py-3 px-6 text-sm text-nowrap font-bold">
                Amount
              </TableHead>
              <TableHead className=" py-3 px-6  text-sm text-nowrap font-bold">
                Bill Status
              </TableHead>
              <TableHead className="px-6 rounded-r-lg  font-bold">
                Details
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.pages ? (
              data?.pages.flatMap((page) =>
                page?.items?.map((due, i) => (
                  <TableRow
                    className={cn(
                      i % 2 === 0 ? "  h-[45px] rounded-xl" : "bg-white/60"
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
                    {/* <TableCell>{due.details}</TableCell> */}
                    <TableCell>
                      {due.amount?.toLocaleString("en-PH") ?? 0}
                    </TableCell>
                    <TableCell>
                      {due.amount_status === "Fully_Paid"
                        ? "Fully Paid"
                        : "Partially Paid"}
                    </TableCell>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <TableCell
                          className={cn(
                            i % 2 === 0
                              ? " bg-opacity-35  font-medium"
                              : " rounded-r-xl"
                          )}
                        >
                          <div className=" w-fit flex items-center gap-1 cursor-pointer">
                            View
                            <Icon
                              icon={"mingcute:arrow-right-up-circle-line"}
                            />
                          </div>
                        </TableCell>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {due.house_list?.house_family_name} Family
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Phase {due.house_list?.house_phase}
                            {", "}
                            {due.house_list?.house_street} Street, Block{" "}
                            {due.house_list?.house_block}, Lot{" "}
                            {due.house_list?.house_lot}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogBody>
                          <div className="mb-6 px-6 py-4 flex w-full justify-between rounded-xl bg-[#F3F7FD]">
                            <div>
                              <p>Billing Month</p>
                              <p>Date Paid</p>
                              <p>Amount</p>
                              {/* <p>Outstanding Balance</p> */}
                              <p>Bill Status</p>
                            </div>
                            <div>
                              <p>
                                {due.date &&
                                  new Date(due.date).toLocaleDateString(
                                    "en-PH",
                                    {
                                      month: "long",
                                      year: "numeric",
                                    }
                                  )}
                              </p>
                              <p>
                                {new Date(due.created_at).toLocaleDateString()}
                              </p>
                              <p>{due.amount?.toLocaleString()}</p>
                              <p>{due.amount_status}</p>
                            </div>
                          </div>
                          <h2 className=" text-default/75 font-bold text-sm">
                            Additional Details:
                          </h2>
                          <p className=" font-medium text-sm">{due.details}</p>
                          <Separator className="my-6 " />

                          <div className="flex">
                            <div className="flex-1">
                              <h3 className="text-[#287EFF] text-sm font-medium">
                                Received By:
                              </h3>
                              <p className="text-sm font-medium">
                                {due?.receiver?.user_first_name}{" "}
                                {due?.receiver?.user_last_name}
                              </p>
                            </div>

                            <div className="flex-1">
                              <h3 className="text-[#02B93F] text-sm font-medium">
                                Confirmed By:
                              </h3>
                              <p className="text-sm font-medium">
                                {due.confirmed_by} Mark Liwanag (hardcoded)
                              </p>
                            </div>
                          </div>
                        </AlertDialogBody>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
    </div>
  );
};

export default PaymentHistory;
