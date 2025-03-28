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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { addHouse, getHouses } from "@/services/houseServices";

import useHouseSearchParams from "@/hooks/useHouseSearchParams";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { houseSchema, HouseSchemaType } from "@/validations/HouseSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Link, useSearchParams } from "react-router";
import { useDebounce } from "@/hooks/useDebounce";
import { Skeleton } from "@/components/ui/skeleton";

const Residents = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [searchInput, setSearchInput] = useState(
    searchParams.get("query") || ""
  );
  const {
    clearFilters,
    updateParams,
    selectedBlock,
    selectedStreet,
    selectedPhase,
    selectedLot,
  } = useHouseSearchParams(setSearchInput);
  const {
    data,
    isError,
    isLoading,
    // fetchNextPage,
    // hasNextPage,
    // isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [
      "houses",
      searchParams.get("query"),
      selectedPhase,
      selectedBlock,
      selectedStreet,
      selectedLot,
    ],
    queryFn: async ({ pageParam }) => {
      const page = pageParam.toString();
      return await getHouses({
        page,
        lot: selectedLot,
        phase: selectedPhase,
        block: selectedBlock,
        query: searchParams.get("query"),
        street: selectedStreet,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined,
  });

  const debouncedSearch = useDebounce(searchInput, 500);

  useEffect(() => {
    if (debouncedSearch) {
      searchParams.set("query", debouncedSearch);
    } else {
      searchParams.delete("query");
    }
    setSearchParams(searchParams);
  }, [debouncedSearch]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const addHouseMutation = useMutation({
    mutationFn: addHouse,
    onError: (error) => {
      toast({
        title: "Error Adding House",
        description: error.message,
      });
    },
    onSuccess: () => {
      toast({
        title: "House Added",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "houses",
          selectedPhase,
          selectedBlock,
          selectedStreet,
          selectedLot,
        ],
      });
      form.reset();
      setDialogOpen(false);
    },
  });

  const handleSubmit = (values: HouseSchemaType) => {
    addHouseMutation.mutate(values);
  };

  const form = useForm<HouseSchemaType>({
    resolver: zodResolver(houseSchema),
    defaultValues: {
      familyName: "",
      phase: "",
      street: "",
      block: "",
      lot: "",
      mainContact: undefined,
    },
  });

  if (isError) {
    return <div>Error fetching data.</div>;
  }

  return (
    <div className="w-full overflow-y-scroll no-scrollbar">
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild className="absolute z-50 right-3 bottom-3">
          <Button className="">Add House Unit</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create House Unit</DialogTitle>
            <DialogDescription>Create House Unit</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <FormField
                control={form.control}
                name="familyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Family Surname</FormLabel>
                    <FormControl>
                      <Input placeholder="Family Surname" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mainContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Main Point of Contact</FormLabel>
                    <FormControl>
                      <Input placeholder="Main Point of Contact" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phase"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phase</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select a phase" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Phase 1</SelectItem>
                          <SelectItem value="2">Phase 2</SelectItem>
                          <SelectItem value="3">Phase 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select a Street" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mangga">Mangga</SelectItem>
                          <SelectItem value="Avocado">Avocado</SelectItem>
                          <SelectItem value="Payaya">Payaya</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lot"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lot</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select a Lot" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="block"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Block</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select a Lot" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <div className="flex gap-4 mb-4">
        <Input
          className="w-[400px] rounded-xl bg-white h-[42px]"
          placeholder="Search Household Units"
          value={searchInput}
          onChange={handleSearchChange}
        />
        <Select
          value={selectedPhase || ""}
          onValueChange={(value) => updateParams("phase", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Phases" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Phase 1</SelectItem>
            <SelectItem value="2">Phase 2</SelectItem>
            <SelectItem value="3">Phase 3</SelectItem>
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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="py-3 px-6 rounded-l-xl text-sm text-nowrap font-bold">
              Family Name
            </TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Main Contact</TableHead>
            <TableHead className="px-6 rounded-r-lg font-bold">
              Details
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            // Skeleton rows when loading
            Array.from({ length: 5 }, (_, index) => (
              <TableRow
                key={`skeleton-${index}`}
                className={index % 2 === 0 ? "" : "bg-white/60"}
              >
                <TableCell colSpan={4}>
                  <Skeleton className="h-8 w-full" />
                </TableCell>
              </TableRow>
            ))
          ) : data?.pages &&
            data.pages.flatMap((page) => page)[0].items.length > 0 ? (
            // Actual data when loaded
            data.pages
              .flatMap((page) => page.items)
              .map((data, i) => (
                <TableRow
                  className={cn(
                    "h-[45px]",
                    i % 2 === 0 ? "rounded-xl" : "bg-white/60"
                  )}
                  key={i}
                >
                  <TableCell className={cn(i % 2 === 0 ? "" : "rounded-l-xl")}>
                    {data.house_family_name}
                  </TableCell>
                  <TableCell>{`${data.house_phase}, ${data.house_street}, ${data.house_block}, ${data.house_lot}`}</TableCell>
                  <TableCell>
                    {data.house_main_poc_user?.user_first_name}{" "}
                    {data.house_main_poc_user?.user_last_name}
                  </TableCell>
                  <TableCell className={cn(i % 2 === 0 ? "" : "rounded-r-xl")}>
                    <Link to={`/residents/${data.id}`}>
                      <Button variant={"ghost"}>View</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
          ) : (
            // No data message
            <TableRow>
              <TableCell colSpan={4} className="text-center">
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
