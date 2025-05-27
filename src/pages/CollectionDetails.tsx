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
import CollectionForm from "@/components/Collection/CollectionForm";
import Loading from "@/components/Loading";

import useHouseSearchParams from "@/hooks/useHouseSearchParams";
import { cn, formatAmount, formatDate } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { ChangeEvent, useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useNavigate, useSearchParams, useParams } from "react-router";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  fetchBlocksByPhase,
  fetchLotsByBlock,
  fetchStreetsByPhase,
} from "@/services/subdivisionServices";
import useUserContext from "@/hooks/useUserContext";
import { Badge } from "@/components/ui/badge";

const CollectionDetails = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useUserContext();
  const { phase } = useParams();

  const { data: blocks, isLoading: blocksLoading } = useQuery({
    queryKey: ["blocks", phase],
    queryFn: async () => {
      return await fetchBlocksByPhase(phase);
    },
    enabled: !!phase,
  });
  const { data: lots, isLoading: lotsLoading } = useQuery({
    queryKey: ["lots", searchParams.get("block")],
    queryFn: async () => {
      return await fetchLotsByBlock(searchParams.get("block"));
    },
    enabled: !!searchParams.get("block"),
  });
  const { data: streets, isLoading: streetsLoading } = useQuery({
    queryKey: ["streets", phase],
    queryFn: async () => {
      return await fetchStreetsByPhase(phase);
    },
    enabled: !!phase,
  });

  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/collection", { replace: true });
  };

  const [searchInput, setSearchInput] = useState(
    searchParams.get("query") || ""
  );
  const {
    clearFilters,
    updateParams,
    selectedBlock,
    selectedStreet,
    selectedLot,
  } = useHouseSearchParams(setSearchInput);

  const debouncedSearch = useDebounce(searchInput, 500);

  // Update search params when debounced search value changes
  useEffect(() => {
    if (debouncedSearch) {
      searchParams.set("query", debouncedSearch);
    } else {
      searchParams.delete("query");
    }
    setSearchParams(searchParams);
  }, [debouncedSearch]);

  const {
    data,
    isError,
    isLoading,
    // fetchNextPage,
    // hasNextPage,
    // isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [
      "collection",
      phase,
      selectedBlock,
      searchParams.get("query"),
      selectedStreet,
      selectedLot,
    ],
    queryFn: async ({ pageParam }) => {
      const page = pageParam.toString();
      return await getHouses({
        page,
        lot: selectedLot,
        query: searchParams.get("query"),
        phase,
        block: selectedBlock,
        street: selectedStreet,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined,
  });

  if (isError) {
    return <div>Error fetching data.</div>;
  }

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  return (
    <div className="h-full overflow-y-scroll no-scrollbar">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Icon
          onClick={handleBackClick}
          className="hover:cursor-pointer opacity-75 w-6 h-6"
          icon={"mingcute:arrow-left-line"}
        />
        <Input
          className="w-full max-w-[300px] rounded-xl bg-white h-[42px]"
          placeholder="Search Household Units"
          value={searchInput}
          onChange={handleSearchChange}
        />
        <Select
          value={selectedStreet || ""}
          disabled={streetsLoading || !streets}
          onValueChange={(value) => {
            if (value === "all") {
              // Remove the street parameter instead of setting it to "all"
              const params = new URLSearchParams(searchParams);
              params.delete("street");
              // Also clear block and lot since they depend on street
              params.delete("block");
              params.delete("lot");
              setSearchParams(params);
            } else {
              updateParams("street", value);
            }
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={selectedStreet || "All Streets"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"all"}>All Streets</SelectItem>
            {streets?.map((street) => (
              <SelectItem key={street.id} value={street.id}>
                {street.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={selectedBlock || ""}
          disabled={blocksLoading || !blocks}
          onValueChange={(value) => {
            if (value === "all") {
              const params = new URLSearchParams(searchParams);

              params.delete("block");
              params.delete("lot");
              setSearchParams(params);
            } else {
              updateParams("block", value);
            }
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue
              placeholder={
                selectedBlock ? `Block ${selectedBlock}` : "All Blocks"
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"all"}>All Blocks</SelectItem>

            {blocks?.map((block) => (
              <SelectItem key={block.id} value={block.id}>
                {block.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedLot || ""}
          disabled={lotsLoading || !lots}
          onValueChange={(value) => {
            if (value === "all") {
              const params = new URLSearchParams(searchParams);
              params.delete("lot");
              setSearchParams(params);
            } else {
              updateParams("lot", value);
            }
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue
              placeholder={selectedLot ? `Lot ${selectedLot}` : "All Lots"}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"all"}>All Lots</SelectItem>

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
      <Separator className="mb-8 mt-3 bg-[#BAC1D6]/40" />
      <h1 className="font-bold">Household Units</h1>

      {isLoading ? (
        <Loading />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="py-3 px-6 rounded-l-xl text-sm text-nowrap font-bold">
                Family Name
              </TableHead>
              <TableHead className="py-3 px-6 text-sm text-nowrap font-bold">
                Address
              </TableHead>
              <TableHead className="py-3 px-6 text-sm text-nowrap font-bold">
                Main Contact
              </TableHead>
              <TableHead className="py-3 px-6 text-sm text-nowrap font-bold">
                Latest Payment Date
              </TableHead>
              <TableHead className="py-3 px-6 text-sm text-nowrap font-bold">
                Latest Payment Amount
              </TableHead>
              <TableHead className="py-3 px-6 text-sm text-nowrap font-bold">
                Arrear
              </TableHead>
              <TableHead className="py-3 px-6 text-sm text-nowrap font-bold">
                Status
              </TableHead>
              <TableHead className="px-6 rounded-r-lg font-bold">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.pages && data?.pages.flatMap((page) => page).length > 0 ? (
              data.pages
                .flatMap((page) => page.items)
                .map((house, i) => (
                  <TableRow
                    className={cn(
                      i % 2 === 0 ? "h-[45px] rounded-xl" : "bg-white/60"
                    )}
                    key={i}
                  >
                    <TableCell
                      className={cn(
                        i % 2 === 0 ? "font-medium" : "rounded-l-xl"
                      )}
                    >
                      {house.house_family_name}
                    </TableCell>
                    <TableCell className="">{` ${house.phases?.name}, ${house?.streets?.name}, ${house?.blocks?.name}, ${house?.lots?.name}`}</TableCell>
                    <TableCell>
                      {house.house_main_poc_user?.user_first_name}{" "}
                      {house.house_main_poc_user?.user_last_name}
                    </TableCell>
                    <TableCell>
                      {house.house_latest_payment
                        ? formatDate(house.house_latest_payment)
                        : "No Payment Yet"}
                    </TableCell>
                    <TableCell>
                      {formatAmount(house.house_latest_payment_amount ?? 0)}
                    </TableCell>
                    <TableCell>
                      {formatAmount(house.house_arrears ?? 0)}
                    </TableCell>
                    <TableCell>
                      {house.house_latest_payment &&
                      (new Date(house.house_latest_payment).getMonth() ===
                        new Date().getMonth() ||
                        new Date(house.house_latest_payment).getMonth() >
                          new Date().getMonth()) ? (
                        <Badge
                          variant={"outline"}
                          className="bg-green-100 text-green-800"
                        >
                          Paid
                        </Badge>
                      ) : (
                        <Badge
                          variant={"outline"}
                          className="bg-red-100 text-red-800"
                        >
                          Unpaid
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell
                      className={cn(
                        i % 2 === 0
                          ? "bg-opacity-35 font-medium"
                          : "rounded-r-xl"
                      )}
                    >
                      {((house.house_arrears && house.house_arrears > 0) ||
                        !house.house_latest_payment ||
                        new Date(house.house_latest_payment).getMonth() <
                          new Date().getMonth()) &&
                        user?.id !== house?.house_main_poc_user?.id && (
                          <CollectionForm
                            // arrears={house.house_arrears ?? 0}
                            houseLatestPayment={house.house_latest_payment}
                            familyName={house.house_family_name}
                            houseId={house.id}
                          />
                        )}
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  No houses available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default CollectionDetails;
