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
import {
  useInfiniteQuery,
  // useMutation,
  // useQueryClient,
} from "@tanstack/react-query";
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
import { fetchDueLogs } from "@/services/dueServices";
// import useUserContext from "@/hooks/useUserContext";
// import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
// import { approveCollection } from "@/services/houseServices";
import { usePhaseContext } from "@/context/phaseContext";
import { Phase } from "@/types/subdivisionTypes";

const PaymentHistory = () => {
  const { phases } = usePhaseContext();
  const [searchParams, setSearchParams] = useSearchParams();
  // const { user } = useUserContext();
  // const queryClient = useQueryClient();
  const [searchInput, setSearchInput] = useState(
    searchParams.get("query") || ""
  );

  // Add approve transaction mutation
  // const confirmMutation = useMutation({
  //   mutationFn: approveCollection,
  //   onSuccess: () => {
  //     toast({
  //       title: "Transaction approved successfully",
  //     });
  //     // Refetch transactions data to update the UI
  //     queryClient.invalidateQueries({ queryKey: ["paymentHistory"] });
  //   },
  //   onError: () => {
  //     toast({
  //       title: "Error approving transaction",
  //       variant: "destructive",
  //     });
  //   },
  // });
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
    if (searchParams.get(key) === "all") {
      searchParams.delete(key);
    } else {
      searchParams.set(key, value);
      setSearchParams(searchParams);
    }
  };

  const { ref } = useInterObserver(fetchNextPage);

  if (isError) {
    return <p>Error fetching dues</p>;
  }

  return (
    <div className="  h-full overflow-y-scroll no-scrollbar">
      <div className="flex items-center gap-3 flex-wrap">
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
            <SelectItem value="all">All Phase</SelectItem>
            {phases.map((phase: Phase) => (
              <SelectItem key={phase.id} value={phase.id}>
                {phase.name}
              </SelectItem>
            ))}
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
        {/* <Select
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
        </Select> */}
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
          <TableCaption>A list of collection history.</TableCaption>
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
                      {`${due.house_list?.phases.name}, ${due.house_list?.streets.name}, ${due.house_list?.blocks.name}, ${due.house_list?.lots?.name}`}
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
                      {due.amount_status === "Fully_Paid" ? (
                        <Badge
                          variant={"default"}
                          className=" bg-green-100 text-green-800 shadow-none hover:bg-green-100 "
                        >
                          Fully Paid
                        </Badge>
                      ) : (
                        <Badge
                          variant={"default"}
                          className=" bg-yellow-100 text-yellow-800 shadow-none hover:bg-green-100 "
                        >
                          Partially Paid
                        </Badge>
                      )}
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
                            {due.house_list?.phases?.name},
                            {due.house_list?.streets?.name},
                            {due.house_list?.blocks?.name},
                            {due.house_list?.lots?.name}
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
                              {due.amount_status === "Fully_Paid" ? (
                                <Badge
                                  variant={"default"}
                                  className=" bg-green-100 text-green-800 shadow-none hover:bg-green-100 "
                                >
                                  Fully Paid
                                </Badge>
                              ) : (
                                <Badge
                                  variant={"default"}
                                  className=" bg-yellow-100 text-yellow-800 shadow-none hover:bg-green-100 "
                                >
                                  Partially Paid
                                </Badge>
                              )}
                            </div>
                          </div>
                          <h2 className=" text-default/75 font-bold text-sm">
                            Additional Details:
                          </h2>
                          <p className=" font-medium text-sm">{due.details}</p>
                          {/* <Separator className="my-6 " /> */}

                          {/* <div className="flex">
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
                              {!due.confirmed_by_user ? (
                                <h3 className="text-yellow-600 text-sm font-medium">
                                  Pending Confirmation:
                                </h3>
                              ) : (
                                <h3 className="text-green-600 text-sm font-medium">
                                  Confirmed By:
                                </h3>
                              )}

                              <p className="text-sm font-medium">
                                {due.confirmed_by_user?.user_first_name}{" "}
                                {due.confirmed_by_user?.user_last_name}
                              </p>
                              {!due.confirmed_by_user &&
                                user?.role === "admin" &&
                                `${due.house_list?.house_main_poc_user?.user_first_name} ${due.house_list?.house_main_poc_user?.user_last_name}` !==
                                  `${user.user_first_name} ${user.user_last_name}` &&
                                `${due.receiver?.user_first_name} ${due.receiver?.user_last_name}` !==
                                  `${user.user_first_name} ${user.user_last_name}` && (
                                  <Button
                                    className="mt-2"
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      confirmMutation.mutate({
                                        dueId: due.id,
                                        userId: user.id,
                                      })
                                    }
                                    disabled={confirmMutation.isPending}
                                  >
                                    <Icon
                                      icon="mingcute:check-circle-line"
                                      className="mr-1 h-4 w-4 text-green-600"
                                    />
                                    {confirmMutation.isPending
                                      ? "Confirming..."
                                      : "Confirm Transaction"}
                                  </Button>
                                )}
                            </div>
                          </div> */}
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
