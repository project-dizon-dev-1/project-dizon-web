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
  // DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Button } from "@/components/ui/button";
import HouseDetails from "@/components/Houses/HouseDetails";
import HouseResidents from "@/components/Houses/HouseResidents";
import HouseEmployees from "@/components/Houses/HouseEmployees";
import HouseVehicles from "@/components/Houses/HouseVehicles";

const Home = () => {
  const dummyData = [
    {
      id: 1,
      familyName: "Smith",
      phase: "Phase 1",
      address: "123 Elm Street",
      mainContact: "John Smith",
      latestPayment: "2025-01-01",
    },
    {
      id: 2,
      familyName: "Johnson",
      phase: "Phase 2",
      address: "456 Oak Avenue",
      mainContact: "Jane Johnson",
      latestPayment: "2025-01-03",
    },
    {
      id: 3,
      familyName: "Williams",
      phase: "Phase 3",
      address: "789 Pine Road",
      mainContact: "Paul Williams",
      latestPayment: "2025-01-05",
    },
    {
      id: 4,
      familyName: "Brown",
      phase: "Phase 1",
      address: "321 Maple Lane",
      mainContact: "Emily Brown",
      latestPayment: "2025-01-04",
    },
    {
      id: 5,
      familyName: "Davis",
      phase: "Phase 2",
      address: "654 Birch Boulevard",
      mainContact: "Michael Davis",
      latestPayment: "2025-01-02",
    },
  ];

  return (
    <div className=" p-4">
      <h1 className=" font-bold text-3xl mb-5">Houses</h1>
      <div className=" flex gap-4 mb-4">
        <Input className=" w-96" placeholder="Filter by family name..." />
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

      <Table className=" border border-zinc-300 rounded-2xl">
        <TableHeader>
          <TableRow>
            <TableHead>Family Name</TableHead>
            <TableHead>Phase</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Main Contact</TableHead>
            <TableHead>Latest Payment</TableHead>
            <TableHead>View</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dummyData.map((data) => (
            <TableRow>
              <TableCell>{data.familyName}</TableCell>
              <TableCell>{data.phase}</TableCell>
              <TableCell>{data.address}</TableCell>
              <TableCell>{data.mainContact}</TableCell>
              <TableCell>{data.latestPayment}</TableCell>
              <Dialog>
                <DialogTrigger>
                  <TableCell>
                    <Button>View Details</Button>
                  </TableCell>
                </DialogTrigger>
                <DialogContent className=" flex flex-col h-[50%] max-h-[50%]">
                  <DialogHeader>
                    <DialogTitle>{data.familyName} Family Details</DialogTitle>
                  </DialogHeader>
                  <Tabs defaultValue="details" className="w-full max-h-full overflow-scroll no-scrollbar ">
                    <TabsList className="w-full flex justify-between">
                      <TabsTrigger className="flex-1" value="details">Details</TabsTrigger>
                      <TabsTrigger className="flex-1" value="residents">Residents</TabsTrigger>
                      <TabsTrigger className="flex-1" value="employees">Employees</TabsTrigger>
                      <TabsTrigger className="flex-1" value="vehicles">Vehicles</TabsTrigger>
                    </TabsList>
                    <TabsContent  value="details">
                      <HouseDetails address={data.address} phase={data.phase} mainContact={data.mainContact} latestPayment={data.latestPayment}/>
                    </TabsContent>
                    <TabsContent value="residents">
                      <HouseResidents/>
                    </TabsContent>
                    <TabsContent value="employees">
                      <HouseEmployees/>
                    </TabsContent>
                    <TabsContent value="vehicles">
                      <HouseVehicles/>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Home;
