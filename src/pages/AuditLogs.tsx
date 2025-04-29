import { fetchAudits } from "@/services/auditServices";
import { useInfiniteQuery } from "@tanstack/react-query";
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
import { Skeleton } from "@/components/ui/skeleton";
import useInterObserver from "@/hooks/useIntersectObserver";
import { cn } from "@/lib/utils";

const AuditLogs = () => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["auditLogs"],
    queryFn: async ({ pageParam }) => {
      const page = pageParam.toString();
      return await fetchAudits(page, "10");
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined,
  });

  // Intersection observer for infinite loading
  const { ref } = useInterObserver(fetchNextPage);

  // Format date to readable format
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isError) {
    return <div className="p-4">Error fetching audit logs</div>;
  }

  return (
    <div className="h-full overflow-y-auto no-scrollbar">
      <h1 className="font-bold mb-4">System Audit Logs</h1>
      <Separator className="mb-4 bg-[#BAC1D6]/40" />

      {isLoading ? (
        <Loading />
      ) : (
        <Table>
          <TableCaption>
            A history of system activities and changes
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="py-3 px-6 rounded-l-xl text-sm font-bold w-64">
                Timestamp
              </TableHead>
              <TableHead className="py-3 px-6 text-sm font-bold w-48">
                User
              </TableHead>
              <TableHead className="py-3 px-6 text-sm font-bold rounded-r-xl">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.pages ? (
              data.pages.flatMap((page) =>
                page?.items?.map((audit, i) => (
                  <TableRow
                    className={cn(
                      i % 2 === 0 ? "h-[45px] rounded-xl" : "bg-white/60"
                    )}
                    key={audit.id}
                  >
                    <TableCell
                      className={cn(
                        i % 2 === 0 ? "font-medium" : "rounded-l-xl"
                      )}
                    >
                      {formatDate(audit.created_at)}
                    </TableCell>
                    <TableCell>
                      {audit.users_list?.user_first_name}{" "}
                      {audit.users_list?.user_last_name}
                    </TableCell>
                    <TableCell
                      className={cn("md:text-wrap text-nowrap", {
                        "rounded-r-xl": i % 2 === 0,
                      })}
                    >
                      {audit.description}
                    </TableCell>
                  </TableRow>
                ))
              )
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  No audit logs available
                </TableCell>
              </TableRow>
            )}

            {hasNextPage && (
              <TableRow ref={ref}>
                <TableCell colSpan={3}>
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

export default AuditLogs;
