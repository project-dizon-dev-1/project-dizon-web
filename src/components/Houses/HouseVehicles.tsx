import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";

const HouseVehicles = () => {
    const dummyVehicles = [
        {
          name: "Honda Civic",
          color: "Black",
          plateNumber: "ABC 423",
          stickerExpiration: "July 15, 2024",
        },
        {
          name: "Toyota Vios",
          color: "White",
          plateNumber: "XYZ 321",
          stickerExpiration: "December 1, 2023",
        },
      ];
    return (
        <Table>
        <TableHeader>
          <TableRow>
            <TableHead >Name</TableHead>
            <TableHead>Color</TableHead>
            <TableHead >Plate Number</TableHead>
            <TableHead >Sticker Expiration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dummyVehicles.map((data) => (
            <TableRow>
              <TableCell className="font-medium">{data.name}</TableCell>
              <TableCell>{data.color}</TableCell>
              <TableCell>{data.plateNumber}</TableCell>
              <TableCell className="text-right">{data.stickerExpiration}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }
  
  export default HouseVehicles