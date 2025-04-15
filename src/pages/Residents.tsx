import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getHouses } from "@/services/houseServices";
import useHouseSearchParams from "@/hooks/useHouseSearchParams";
import { ChangeEvent, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Link, useSearchParams } from "react-router";
import { useDebounce } from "@/hooks/useDebounce";
import { Skeleton } from "@/components/ui/skeleton";
import { useSubdivisionContext } from "@/context/phaseContext";
import {
  fetchBlocksByStreet,
  fetchLotsByBlock,
  fetchStreetsByPhase,
} from "@/services/subdivisionServices";
import ResidentForm from "@/components/Residents/ResidentForm";
import useInterObserver from "@/hooks/useIntersectObserver";
import { Icon } from "@iconify/react/dist/iconify.js";

const Residents = () => {
  const { phases } = useSubdivisionContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(
    searchParams.get("query") || ""
  );
  const {
    clearFilters,
    updateParams,
    selectedBlock,
    selectedStreet,
    selectedPhase,
    selectedLot,
  } = useHouseSearchParams(setSearchInput);

  // Fetch blocks based on selected phase
  const { data: blocks, isLoading: blocksLoading } = useQuery({
    queryKey: ["blocks", selectedStreet],
    queryFn: async () => await fetchBlocksByStreet(selectedStreet),
    enabled: !!selectedStreet,
  });

  // Fetch streets based on selected phase
  const { data: streets, isLoading: streetsLoading } = useQuery({
    queryKey: ["streets", selectedPhase],
    queryFn: async () => await fetchStreetsByPhase(selectedPhase),
    enabled: !!selectedPhase,
  });

  // Fetch lots based on selected block
  const { data: lots, isLoading: lotsLoading } = useQuery({
    queryKey: ["lots", selectedBlock],
    queryFn: async () => await fetchLotsByBlock(selectedBlock),
    enabled: !!selectedBlock,
  });

  const handlePhaseChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);

    if (value) {
      newParams.set("phase", value);
    } else {
      newParams.delete("phase");
    }

    newParams.delete("block");
    newParams.delete("street");
    newParams.delete("lot");

    setSearchParams(newParams);
  };

  const handleBlockChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);

    if (value) {
      newParams.set("block", value);
    } else {
      newParams.delete("block");
    }

    newParams.delete("lot");

    setSearchParams(newParams);
  };

  const {
    data,
    isError,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [
      "houses",
      searchParams.get("query"),
      selectedPhase,
      selectedBlock,
      selectedStreet,
      selectedLot,
    ],
    queryFn: async ({ pageParam }) => {
      const page = pageParam.toString();
      return await getHouses({
        page,
        lot: selectedLot,
        phase: selectedPhase,
        block: selectedBlock,
        query: searchParams.get("query"),
        street: selectedStreet,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined,
  });

  const debouncedSearch = useDebounce(searchInput, 500);

  useEffect(() => {
    if (debouncedSearch) {
      searchParams.set("query", debouncedSearch);
    } else {
      searchParams.delete("query");
    }
    setSearchParams(searchParams);
  }, [debouncedSearch]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  // Intersection observer hook to trigger loading next page
  const { ref } = useInterObserver(fetchNextPage);

  if (isError) {
    return <div>Error fetching data.</div>;
  }

  return (
    <div className="w-full overflow-y-scroll no-scrollbar">
      <ResidentForm />
      <div className="flex gap-4 mb-4">
        <Input
          className="w-auto rounded-xl bg-white h-[42px]"
          placeholder="Search Household Units"
          value={searchInput}
          onChange={handleSearchChange}
        />
        <Select value={selectedPhase || ""} onValueChange={handlePhaseChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Phases" />
          </SelectTrigger>
          <SelectContent>
            {phases.map((phase) => (
              <SelectItem key={phase.id} value={phase.id}>
                {phase.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={selectedStreet || ""}
          onValueChange={(value) => updateParams("street", value)}
          disabled={!selectedPhase || streetsLoading}
        >
          <SelectTrigger className="w-[180px]">
            {streetsLoading ? (
              <div className="flex items-center">
                <Icon
                  icon="mingcute:loading-3-line"
                  className="h-5 w-5 animate-spin text-gray-500"
                ></Icon>

                <span>Loading...</span>
              </div>
            ) : (
              <SelectValue placeholder="All Streets" />
            )}
          </SelectTrigger>
          <SelectContent>
            {streets?.map((street) => (
              <SelectItem key={street.id} value={street.id}>
                {street.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={selectedBlock || ""}
          onValueChange={handleBlockChange}
          disabled={!selectedPhase || blocksLoading}
        >
          <SelectTrigger className="w-[180px]">
            {blocksLoading ? (
              <div className="flex items-center">
                <Icon
                  icon="mingcute:loading-3-line"
                  className="h-5 w-5 animate-spin text-gray-500"
                ></Icon>

                <span>Loading...</span>
              </div>
            ) : (
              <SelectValue placeholder="All Blocks" />
            )}
          </SelectTrigger>
          <SelectContent>
            {blocks?.map((block) => (
              <SelectItem key={block.id} value={block.id}>
                {block.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedLot || ""}
          onValueChange={(value) => updateParams("lot", value)}
          disabled={!selectedBlock || lotsLoading}
        >
          <SelectTrigger className="w-[180px]">
            {lotsLoading ? (
              <div className="flex items-center">
                <Icon
                  icon="mingcute:loading-3-line"
                  className="h-5 w-5 animate-spin text-gray-500"
                ></Icon>

                <span>Loading...</span>
              </div>
            ) : (
              <SelectValue placeholder="All Lots" />
            )}
          </SelectTrigger>
          <SelectContent>
            {lots?.map((lot) => (
              <SelectItem key={lot.id} value={lot.id}>
                {lot.name}
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
              Family Name
            </TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Main Contact</TableHead>
            <TableHead className="px-6 rounded-r-lg font-bold">
              Details
            </TableHead>
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
                <TableCell colSpan={4}>
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
                .map((data, i) => (
                  <TableRow
                    className={cn(
                      "h-[45px]",
                      i % 2 === 0 ? "rounded-xl" : "bg-white/60"
                    )}
                    key={`item-${data.id}-${i}`}
                  >
                    <TableCell
                      className={cn(i % 2 === 0 ? "" : "rounded-l-xl")}
                    >
                      {data.house_family_name}
                    </TableCell>
                    <TableCell>{`${data.phases.name}, ${data.streets?.name}, ${data.blocks?.name}, ${data.lots?.name}`}</TableCell>
                    <TableCell>
                      {data.house_main_poc_user?.user_first_name}{" "}
                      {data.house_main_poc_user?.user_last_name}
                    </TableCell>
                    <TableCell
                      className={cn(i % 2 === 0 ? "" : "rounded-r-xl")}
                    >
                      <Link to={`/residents/${data.id}`}>
                        <Button variant={"ghost"}>View</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}

              {/*  this will be observed by IntersectionObserver */}
              {hasNextPage && (
                <TableRow ref={ref}>
                  <TableCell colSpan={4}>
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
              <TableCell colSpan={4} className="text-center py-8">
                <div className="flex flex-col items-center">
                  <Icon
                    icon="mingcute:home-3-line"
                    className="h-10 w-10 text-gray-300 mb-2"
                  />
                  <p className="text-muted-foreground">No houses available</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Residents;
