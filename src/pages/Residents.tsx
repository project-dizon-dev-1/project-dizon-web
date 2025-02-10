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
import { useQuery } from "@tanstack/react-query";
import { getHouses } from "@/services/houseServices";


const Residents = () => {
  const {
    data: houses,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["houses"],
    queryFn: getHouses,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching data.</div>;
  }

  return (
    <div className="p-4 w-full">
      <h1 className="font-bold text-3xl mb-5">Houses</h1>
      <div className="flex gap-4 mb-4">
        <Input className="w-96" placeholder="Filter by family name..." />
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Phases" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Phase 1</SelectItem>
            <SelectItem value="dark">Phase 2</SelectItem>
            <SelectItem value="system">Phase 3</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Blocks" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Block 1</SelectItem>
            <SelectItem value="dark">Block 2</SelectItem>
            <SelectItem value="system">Block 3</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Lots" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Lot 1</SelectItem>
            <SelectItem value="dark">Lot 2</SelectItem>
            <SelectItem value="system">Lot 3</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table className="">
        <TableHeader>
          <TableRow>
            <TableHead>Family Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Main Contact</TableHead>
            <TableHead>Latest Payment</TableHead>
            <TableHead>View</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {houses && houses?.length > 0 ? (
            houses?.map((data, i) => (
              <TableRow key={i}>
                <TableCell>{data.house_family_name}</TableCell>
                <TableCell>{`${data.house_phase}, ${data.house_street}, ${data.house_block}, ${data.house_lot}`}</TableCell>
                <TableCell>{data.house_main_poc}</TableCell>
                <TableCell>{data.house_latest_payment ? new Date(data.house_latest_payment).toLocaleDateString('en-GB'): "No Payment yet"}</TableCell>
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
    </div>
  );
};

export default Residents;
