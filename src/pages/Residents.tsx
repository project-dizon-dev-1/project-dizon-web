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

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import HouseResidents from "@/components/Houses/HouseResidents";
import HouseEmployees from "@/components/Houses/HouseEmployees";
import HouseVehicles from "@/components/Houses/HouseVehicles";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getHouses } from "@/services/houseServices";
import { House } from "@/types/HouseTypes";
import { PaginatedDataType } from "@/types/paginatedType";
import useHouseSearchParams from "@/hooks/useHouseSearchParams";
import Loading from "@/components/Loading";

const Residents = () => {
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
      "houses",
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
    <div className="p-4 w-full">
      <h1 className="font-bold text-3xl mb-5">Houses</h1>
      <div className="flex gap-4 mb-4">
        <Input className="w-96" placeholder="Filter by family name..." />
        <Select
          value={selectedPhase || ""}
          onValueChange={(value) => updateParams("phase", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Phases" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Phase 1">Phase 1</SelectItem>
            <SelectItem value="Phase 2">Phase 2</SelectItem>
            <SelectItem value="Phase 3">Phase 3</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={selectedBlock || ""}
          onValueChange={(value) => updateParams("block", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Blocks" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Block 1</SelectItem>
            <SelectItem value="2">Block 2</SelectItem>
            <SelectItem value="3">Block 3</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={selectedLot || ""}
          onValueChange={(value) => updateParams("lot", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Lots" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Lot 1</SelectItem>
            <SelectItem value="2">Lot 2</SelectItem>
            <SelectItem value="3">Lot 3</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={clearFilters} variant={"ghost"}>
          Clear Filters
        </Button>
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Family Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Main Contact</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.pages && data.pages.flatMap((page) => page)[0].items.length > 0 ? (
              data.pages
                .flatMap((page) => page.items)
                .map((data, i) => (
                  <TableRow key={i}>
                    <TableCell>{data.house_family_name}</TableCell>
                    <TableCell>{`${data.house_phase}, ${data.house_street}, ${data.house_block}, ${data.house_lot}`}</TableCell>
                    <TableCell>{data.house_main_poc}</TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <TableCell>
                          <Button>View Details</Button>
                        </TableCell>
                      </DialogTrigger>
                      <DialogContent className="flex flex-col h-[50%] max-h-[50%]">
                        <DialogHeader>
                          <DialogTitle>
                            {data.house_family_name} Family Details
                          </DialogTitle>
                        </DialogHeader>
                        <Tabs
                          defaultValue="details"
                          className="w-full max-h-full overflow-scroll no-scrollbar"
                        >
                          <TabsList className="w-full flex justify-between">
                            <TabsTrigger className="flex-1" value="details">
                              Details
                            </TabsTrigger>
                            <TabsTrigger className="flex-1" value="residents">
                              Residents
                            </TabsTrigger>
                            <TabsTrigger className="flex-1" value="employees">
                              Employees
                            </TabsTrigger>
                            <TabsTrigger className="flex-1" value="vehicles">
                              Vehicles
                            </TabsTrigger>
                          </TabsList>
                          <TabsContent value="details">
                            {/* <HouseDetails
                          address={data.house_address}
                          phase={data.house_phase}
                          mainContact={data.house_main_poc}
                          latestPayment={data.house_latest_payment}
                        /> */}
                          </TabsContent>
                          <TabsContent value="residents">
                            <HouseResidents />
                          </TabsContent>
                          <TabsContent value="employees">
                            <HouseEmployees />
                          </TabsContent>
                          <TabsContent value="vehicles">
                            <HouseVehicles />
                          </TabsContent>
                        </Tabs>
                      </DialogContent>
                    </Dialog>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
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

export default Residents;
