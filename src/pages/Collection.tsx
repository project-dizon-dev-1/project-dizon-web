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

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getHouses } from "@/services/houseServices";
import CollectionForm from "@/components/Collection/CollectionForm";
import Loading from "@/components/Loading";
import { PaginatedDataType } from "@/types/paginatedType";
import { House } from "@/types/HouseTypes";
import useHouseSearchParams from "@/hooks/useHouseSearchParams";

const Collection = () => {
  const {
    clearFilters,
    updateParams,
    selectedBlock,
    selectedStreet,
    selectedPhase,
    selectedLot,
    
  } = useHouseSearchParams();

  const {
    data,
    isError,
    isLoading,
    // fetchNextPage,
    // hasNextPage,
    // isFetchingNextPage,
  } = useInfiniteQuery<PaginatedDataType<House>, Error>({
    queryKey: [
      "collection",
      selectedPhase,
      selectedBlock,
      selectedStreet,
      selectedLot,
    ],
    queryFn: async ({ pageParam }) => {
      const page = pageParam as string;
      return await getHouses({
        page,
        lot: selectedLot,
        phase: selectedPhase,
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

  return (
    <div className="flex flex-col p-4 overflow-x-scroll no-scrollbar flex-1">
      <h1 className="font-bold text-3xl mb-5">Collection</h1>
      <div className="flex flex-wrap gap-4 mb-4">
        <Input className="w-56" placeholder="Filter by family name..." />
        <Select
          value={selectedPhase || ""}
          onValueChange={(value) => updateParams("phase", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={selectedPhase || "All Phases"} />
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
          value={selectedBlock || ""}
          onValueChange={(value) => updateParams("block", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue
              placeholder={
                selectedBlock ? `Block ${selectedBlock}` : "All Blocks"
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Block 1</SelectItem>
            <SelectItem value="2">Block 2</SelectItem>
            <SelectItem value="3">Block 3</SelectItem>
            <SelectItem value="4">Block 4</SelectItem>
            <SelectItem value="5">Block 5</SelectItem>
            <SelectItem value="6">Block 6</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={selectedStreet || ""}
          onValueChange={(value) => updateParams("street", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={selectedStreet || "All Streets"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Mangga">Mangga</SelectItem>
            <SelectItem value="Papaya">Papaya</SelectItem>
            <SelectItem value="Duhat">Duhat</SelectItem>
            <SelectItem value="Avocado">Avocado</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={selectedLot || ""}
          onValueChange={(value) => updateParams("lot", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue
              placeholder={selectedLot ? `Lot ${selectedLot}` : "All Lots"}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Lot 1</SelectItem>
            <SelectItem value="2">Lot 2</SelectItem>
            <SelectItem value="3">Lot 3</SelectItem>
            <SelectItem value="4">Lot 4</SelectItem>
            <SelectItem value="5">Lot 5</SelectItem>
            <SelectItem value="6">Lot 6</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={clearFilters} variant={"ghost"}>
          Clear Filters
        </Button>
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <Table className="rounded-2xl">
          <TableHeader>
            <TableRow>
              <TableHead>Family Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Main Contact</TableHead>
              <TableHead>Latest Payment Date</TableHead>
              <TableHead>Latest Payment Amount</TableHead>
              <TableHead>Arrear</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.pages && data?.pages.flatMap((page) => page).length > 0 ? (
              data.pages
                .flatMap((page) => page.items)
                .map((house, i) => (
                  <TableRow className="h-14" key={i}>
                    <TableCell className=" w-[300px]">
                      {house.house_family_name}
                    </TableCell>
                    <TableCell className=" w-[300px]">{`${house.house_phase}, ${house.house_street} Street, ${house.house_block}, ${house.house_lot}`}</TableCell>
                    <TableCell className=" w-[300px]">
                      {house.house_main_poc}
                    </TableCell>
                    <TableCell className=" w-[300px]">
                      {house.house_latest_payment
                        ? new Date(house.house_latest_payment).toLocaleString(
                            "en-PH",
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            }
                          )
                        : "No Payment Yet"}
                    </TableCell>
                    <TableCell className=" w-[300px]">
                      {house.house_latest_payment_amount?.toLocaleString(
                        "en-PH"
                      ) ?? 0}{" "}
                      ₱
                    </TableCell>
                    <TableCell className=" w-[300px]">
                      {house.house_arrears?.toLocaleString("en-PH") ?? 0} ₱
                    </TableCell>
                    <TableCell className=" w-[300px]">
                      {house.house_latest_payment &&
                      (new Date(house.house_latest_payment).getMonth() ===
                        new Date().getMonth() ||
                        new Date(house.house_latest_payment).getMonth() >
                          new Date().getMonth())
                        ? "Paid"
                        : "Unpaid"}
                    </TableCell>
                    <TableCell className=" w-[300px]">
                      {(!house.house_latest_payment ||
                        new Date(house.house_latest_payment).getMonth() <
                          new Date().getMonth()) && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button>Add Payment</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                {house.house_family_name} Family Payment
                                <CollectionForm houseId={house.id} />
                              </DialogTitle>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                      )}
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
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

export default Collection;
