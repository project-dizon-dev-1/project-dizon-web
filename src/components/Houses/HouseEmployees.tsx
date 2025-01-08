import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const HouseEmployees = () => {
  const dummyEmployees = [
    {
      name: "Katarina Gomez",
      role: "House Maid",
      employmentDate: "June 15, 2024",
    },
    {
      name: "Darius Mozgus",
      role: "Family Driveer",
      employmentDate: "December 11, 2023",
    },
    {
      name: "Katarina Gomez",
      role: "House Maid",
      employmentDate: "June 15, 2024",
    },
    {
      name: "Darius Mozgus",
      role: "Family Driveer",
      employmentDate: "December 11, 2023",
    },
    {
      name: "Katarina Gomez",
      role: "House Maid",
      employmentDate: "June 15, 2024",
    },
    {
      name: "Darius Mozgus",
      role: "Family Driveer",
      employmentDate: "December 11, 2023",
    },
    {
      name: "Katarina Gomez",
      role: "House Maid",
      employmentDate: "June 15, 2024",
    },
    {
      name: "Darius Mozgus",
      role: "Family Driveer",
      employmentDate: "December 11, 2023",
    },
  ];
  return (

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead >Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead >Employment Date</TableHead>

          </TableRow>
        </TableHeader>
        <TableBody>
          {dummyEmployees.map((data) => (
            <TableRow>
              <TableCell className="font-medium">{data.name}</TableCell>
              <TableCell>{data.role}</TableCell>
              <TableCell className="text-right">{data.employmentDate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

  );
};

export default HouseEmployees;
