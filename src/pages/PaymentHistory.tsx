import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { fetchDueLogs } from "@/services/DuesServices";
import Loading from "@/components/Loading";

const PaymentHistory = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dueLogs"],
    queryFn: fetchDueLogs,
  });

  if (isError) {
    return <p>error fetching dues</p>;
  }

  return (
    <div className=" p-4 w-full">
      <h1 className="font-bold text-3xl mb-5">Payment History</h1>

      {isLoading ? (
        <Loading />
      ) : (
        <Table>
          <TableCaption>A list of your history of payments.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Family Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Date Paid</TableHead>
              <TableHead>Payment for the month of</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment Confimed by</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data && data.length > 0 ? (
              data.map((due) => (
                <TableRow key={due.id}>
                  <TableCell className="font-medium">
                    {due.house_list?.house_family_name}
                  </TableCell>
                  <TableCell>{`${due.house_list?.house_phase} ${due.house_list?.house_street} Street Block ${due.house_list?.house_block} Lot ${due.house_list?.house_lot}`}</TableCell>
                  <TableCell>
                    {new Date(due.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {due.date &&
                      new Date(due.date).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                  </TableCell>
                  <TableCell>{due.details}</TableCell>
                  <TableCell>{due.amount}</TableCell>
                  <TableCell>{due.confirmed_by}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No Due Log found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default PaymentHistory;
