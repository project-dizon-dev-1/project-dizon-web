import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const HouseResidents = () => {
  const dummyEmployees = [
    {
      name: "Skye Dalimit",
      contact: "09982017857",
      createdAt: "June 15, 2024",
      familyType: "Mother",
    },
    {
      name: "Viktor Wood",
      contact: "09125047853",
      createdAt: "December 11, 2023",
      familyType: "Father",
    },
    {
      name: "Iron Wood",
      contact: "09125047853",
      createdAt: "December 11, 2023",
      familyType: "Child",
    },
    {
      name: "Branch Wood",
      contact: "09125047853",
      createdAt: "December 11, 2023",
      familyType: "Child",
    },
    
  ];
  return (
    <div className=" h-full ">
      <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
        <TableHead>Contact Number</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Family Type</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {dummyEmployees.map((data) => (
          <TableRow>
            <TableCell className="font-medium">{data.name}</TableCell>
            <TableCell>{data.contact}</TableCell>
            <TableCell>{data.createdAt}</TableCell>
            <TableCell className="text-right">{data.familyType}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </div>
  );
};

export default HouseResidents;
