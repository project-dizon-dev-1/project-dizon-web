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
import { useQuery } from "@tanstack/react-query";
import { getHouses } from "@/services/houseServices";
import CollectionForm from "@/components/Collection/CollectionForm";
import Loading from "@/components/Loading";

const Collection = () => {
  const {
    data: houses,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["houses"],
    queryFn: getHouses,
  });


  if (isError) {
    return <div>Error fetching data.</div>;
  }

  return (
    <div className="p-4 w-full">
      <h1 className="font-bold text-3xl mb-5">Collection</h1>
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

      {isLoading ? <Loading/>:<Table className=" rounded-2xl">
        <TableHeader>
          <TableRow>
            <TableHead>Family Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Main Contact</TableHead>
            <TableHead>Latest Payment Amount</TableHead>
            <TableHead>Arrear</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {houses && houses?.length > 0 ? (
            houses?.map((data, i) => (
              <TableRow key={i}>
                <TableCell>{data.house_family_name}</TableCell>
                <TableCell>{`${data.house_phase}, ${data.house_street} Street, ${data.house_block}, ${data.house_lot}`}</TableCell>
                <TableCell>{data.house_main_poc}</TableCell>
                <TableCell>{data.house_latest_payment_amount ?? 0}</TableCell>
                <TableCell>{data.arrears ?? 0}</TableCell>
                
                <TableCell>
                  {data.house_latest_payment &&
                  new Date(data.house_latest_payment).getMonth ===
                    new Date().getMonth
                    ? "Paid"
                    : "Unpaid"}
                </TableCell>

                <TableCell>
                  {(data?.house_latest_payment &&
                    new Date(data?.house_latest_payment).getMonth !==
                      new Date().getMonth) ||
                    (!data?.house_latest_payment && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button>Add Payment</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              {data.house_family_name} Family Payment
                              <CollectionForm houseId={data?.id}/>
                            </DialogTitle>
                          </DialogHeader>
                          
                        </DialogContent>
                        
                      </Dialog>
                    ))}
                </TableCell>
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
      </Table>}
    </div>
  );
};

export default Collection;
