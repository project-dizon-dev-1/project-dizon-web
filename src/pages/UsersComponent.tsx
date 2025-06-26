import { getAllUsers, updateUserRole } from "@/services/userServices";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChangeEvent, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useSearchParams } from "react-router";
import { useDebounce } from "@/hooks/useDebounce";
import { Skeleton } from "@/components/ui/skeleton";
import useInterObserver from "@/hooks/useIntersectObserver";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import useUserContext from "@/hooks/useUserContext";

const UsersComponent = () => {
  const { user } = useUserContext();
  const queryClient = useQueryClient();
  const roles = ["admin", "resident"] as const;
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(
    searchParams.get("query") || ""
  );

  const {
    data,
    isError,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["users", searchParams.get("query"), searchParams.get("role")],
    queryFn: async ({ pageParam }) => {
      return getAllUsers({
        page: pageParam.toString(),
        pageSize: "10",
        query: searchParams.get("query") ?? undefined,
        role: searchParams.get("role") ?? undefined,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.hasNextPage) return undefined;
      return lastPage.currentPage + 1;
    },
  });

  const debouncedSearch = useDebounce(searchInput, 500);

  useEffect(() => {
    if (debouncedSearch) {
      searchParams.set("query", debouncedSearch);
    } else {
      searchParams.delete("query");
    }
    setSearchParams(searchParams);
  }, [debouncedSearch, searchParams, setSearchParams]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const clearFilters = () => {
    setSearchInput("");
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("query");
    setSearchParams(newParams);
  };

  const {
    mutate,
    isPending,
    variables: pendingVariables,
  } = useMutation({
    mutationFn: updateUserRole,
    onMutate: async (variables: {
      userId: string;
      role: "admin" | "resident";
    }) => {
      const queryKey = [
        "users",
        searchParams.get("query"),
        searchParams.get("role"),
      ];
      await queryClient.cancelQueries({ queryKey });

      const previousUsers = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            items: page.items.map((user: any) =>
              user.id === variables.userId
                ? { ...user, role: variables.role }
                : user
            ),
          })),
        };
      });

      return { previousUsers };
    },
    onSuccess: () => {
      toast({
        title: "Role updated successfully!",
      });
      queryClient.invalidateQueries({
        queryKey: ["user", user?.id],
      });
    },
    onError: (_err, _variables, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(
          ["users", searchParams.get("query"), searchParams.get("role")],
          context.previousUsers
        );
      }
      toast({
        title: "Failed to update role.",
        variant: "destructive",
      });
    },
  });

  const { ref } = useInterObserver(fetchNextPage);

  if (isError) {
    return <div>Error fetching data.</div>;
  }

  return (
    <div className="w-full overflow-y-scroll no-scrollbar">
      <div className="flex gap-4 mb-4 flex-wrap">
        <Input
          className="w-[428px]  rounded-xl bg-white h-[42px]"
          placeholder="Search Users by Name or Email"
          value={searchInput}
          onChange={handleSearchChange}
        />
        <Select
          value={searchParams.get("role") || "all"}
          onValueChange={(value) => {
            const newParams = new URLSearchParams(searchParams);
            if (value === "all") {
              newParams.delete("role");
            } else {
              newParams.set("role", value);
            }
            setSearchParams(newParams);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all"> All Roles</SelectItem>
            {roles.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={clearFilters} variant={"ghost"}>
          Clear Filters
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="py-3 px-6 rounded-l-xl text-sm text-nowrap font-bold">
              Name
            </TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="px-6 rounded-r-lg font-bold">Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            // Skeleton rows when loading
            Array.from({ length: 5 }, (_, index) => (
              <TableRow
                key={`skeleton-${index}`}
                className={index % 2 === 0 ? "" : "bg-white/60"}
              >
                <TableCell colSpan={3}>
                  <Skeleton className="h-8 w-full" />
                </TableCell>
              </TableRow>
            ))
          ) : data?.pages &&
            data.pages.some((page) => page.items.length > 0) ? (
            <>
              {/* Render data */}
              {data.pages
                .flatMap((page) => page.items)
                .map((user, i) => (
                  <TableRow
                    className={cn(
                      "h-[45px]",
                      i % 2 === 0 ? "rounded-xl" : "bg-white/60"
                    )}
                    key={`item-${user.id}-${i}`}
                  >
                    <TableCell
                      className={cn(i % 2 === 0 ? "" : "rounded-l-xl")}
                    >
                      {user.user_first_name} {user.user_last_name}
                    </TableCell>
                    <TableCell>{user.user_email}</TableCell>
                    <TableCell
                      className={cn(i % 2 === 0 ? "" : "rounded-r-xl")}
                    >
                      <Select
                        disabled={
                          isPending && pendingVariables?.userId === user.id
                        }
                        value={user.role}
                        onValueChange={(value: "admin" | "resident") =>
                          mutate({
                            userId: user.id,
                            role: value,
                          })
                        }
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}

              {/*  this will be observed by IntersectionObserver */}
              {hasNextPage && (
                <TableRow ref={ref}>
                  <TableCell colSpan={3}>
                    {isFetchingNextPage ? (
                      <Skeleton className="h-8 w-full rounded-md my-2" />
                    ) : (
                      <div className="h-16" />
                    )}
                  </TableCell>
                </TableRow>
              )}
            </>
          ) : (
            // No data message
            <TableRow>
              <TableCell colSpan={3} className="text-center py-8">
                <div className="flex flex-col items-center">
                  <Icon
                    icon="mingcute:user-3-line"
                    className="h-10 w-10 text-gray-300 mb-2"
                  />
                  <p className="text-muted-foreground">No users available</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersComponent;
