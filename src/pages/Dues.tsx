import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DuesForm from "@/components/Dues/DuesForm";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteDues, fetchDues, fetchTotalDue } from "@/services/DuesServices";
import { Skeleton } from "@/components/ui/skeleton";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Loading from "@/components/Loading";
import { toast } from "@/hooks/use-toast";

const Dues = () => {
  // State to manage dialog visibility

  const {
    data: dues,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["dues"],
    queryFn: async () => fetchDues(),
  });

  const queryClient = useQueryClient();

  const { data: totalDueData, isLoading: totalIsLoading } = useQuery({
    queryKey: ["totalDue"],
    queryFn: async () => fetchTotalDue(),
  });

  const { mutate } = useMutation({
    mutationFn: deleteDues,
    onSuccess: () => {
      toast({
        title: "Due Deleted Successfully",
      });
    },
    onMutate: () => {
      toast({
        title: "Deleting Dues...",
      });
    },
    onError: () => {
      toast({
        title: "Error Deleting Dues",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["dues"],
      });
      queryClient.invalidateQueries({
        queryKey: ["totalDue"],
      });
    },
  });

  if (isError) {
    return <p>error fetching dues</p>;
  }

  return (
    <div className="relative p-4 w-full">
      <h1 className="font-bold text-3xl mb-5">Dues</h1>

      {isLoading ? (
        <Loading />
      ) : (
        <Table>
          <TableCaption>A list of your dues.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dues && dues?.length > 0 ? (
              dues.map((due) => (
                <TableRow key={due.id}>
                  <TableCell className="font-medium">{due.due_name}</TableCell>
                  <TableCell>{due.due_description}</TableCell>
                  <TableCell>{due.due_cost}</TableCell>
                  <TableCell>
                    {due.due_is_active ? "Active" : "Inactive"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger>
                        <Button variant={"ghost"} className="">
                          ...
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Deactivate</DropdownMenuItem>
                        {/* Prevents the dialog from closing */}
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Dialog>
                            <DialogTrigger asChild>
                              <p className="">Edit due</p>
                            </DialogTrigger>

                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit due.</DialogTitle>
                                <DialogDescription>Edit Due</DialogDescription>
                              </DialogHeader>
                              <DuesForm data={due} />
                            </DialogContent>
                          </Dialog>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Dialog>
                            <DialogTrigger asChild>
                              <p className="">Delete due</p>
                            </DialogTrigger>

                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Delete due</DialogTitle>
                                <DialogDescription>
                                  Are you absolutely sure you want to delete
                                  this due?
                                </DialogDescription>
                              </DialogHeader>
                              <div className=" flex justify-end">
                                <DialogClose>
                                  <Button
                                    onClick={() => mutate(due.id)}
                                    variant={"destructive"}
                                  >
                                    Delete
                                  </Button>
                                </DialogClose>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No Dues found.
                </TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell colSpan={2} className="font-medium text-right">
                Total Due Amount:
              </TableCell>
              <TableCell colSpan={4}>
                {totalIsLoading ? (
                  <Skeleton className="h-4 w-10" />
                ) : (
                  totalDueData?.total_due
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}

      <Dialog>
        <DialogTrigger asChild>
          <Button className="absolute p-5 rounded-3xl right-5 bottom-5">
            Add due
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a new due</DialogTitle>
            <DialogDescription>Add a due to be payed.</DialogDescription>
          </DialogHeader>
          <DuesForm data={null} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dues;
