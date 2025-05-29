import { Separator } from "@/components/ui/separator";
import { createCode, getHouse } from "@/services/houseServices";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const ResidentDetails = () => {
  const { houseId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const goBack = () => {
    navigate(-1);
  };

  const {
    data,
    isLoading: houseLoading,
    isError: houseError,
  } = useQuery({
    queryKey: ["housedetails", houseId],
    queryFn: async () => await getHouse(houseId),
    enabled: !!houseId,
  });

  // const {
  //   data: vehicles,
  //   isLoading: vehiclesLoading,
  //   isError: vehiclesError,
  // } = useQuery({
  //   queryKey: ["vehicle", houseId],
  //   queryFn: async () => await getHouseVehicle(houseId),
  // });

  const { mutate, isPending } = useMutation({
    mutationFn: async () => await createCode(houseId),
    onSuccess: () => {
      toast({
        title: "Access code generated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error generating access code",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      // Invalidate the query to refresh the house data
      queryClient.invalidateQueries({ queryKey: ["housedetails", houseId] });
    },
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
    });
  };

  return (
    <div>
      <div className="flex gap-3">
        <Icon
          onClick={goBack}
          className="hover:cursor-pointer opacity-75 w-6 h-6"
          icon={"mingcute:arrow-left-line"}
        />
        <h1 className="text-xl font-bold">
          {houseLoading ? (
            <Skeleton className="h-7 w-64 inline-block" />
          ) : (
            `${data?.house_family_name || ""} House Details`
          )}
        </h1>
      </div>
      <Separator className="mt-3 mb-8 bg-[#45495A]/[.12]" />

      {/* House details table */}
      <h1 className="font-bold mb-3">Details</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="py-3 px-6 rounded-l-xl text-sm text-nowrap font-bold">
              Property
            </TableHead>
            <TableHead className="py-3 px-6 rounded-r-xl text-sm text-nowrap font-bold">
              Value
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {houseLoading ? (
            Array.from({ length: 3 }, (_, i) => (
              <TableRow
                key={`house-skeleton-${i}`}
                className={i % 2 === 0 ? "" : "bg-white/60"}
              >
                <TableCell colSpan={2}>
                  <Skeleton className="h-8 w-full" />
                </TableCell>
              </TableRow>
            ))
          ) : houseError ? (
            <TableRow>
              <TableCell colSpan={2} className="text-center text-red-500 py-4">
                Error loading house details
              </TableCell>
            </TableRow>
          ) : (
            <>
              <TableRow className="h-[45px]">
                <TableCell className="text-sm font-medium">Address</TableCell>
                <TableCell className="text-sm font-medium">{` ${data?.streets?.name} ,  ${data?.blocks?.name},  ${data?.lots?.name}`}</TableCell>
              </TableRow>
              <TableRow className="bg-white/60 h-[45px]">
                <TableCell className="rounded-l-xl text-sm font-medium">
                  Phase
                </TableCell>
                <TableCell className="rounded-r-xl text-sm font-medium">
                  {data?.phases?.name}
                </TableCell>
              </TableRow>
              <TableRow className="h-[45px]">
                <TableCell className="text-sm font-medium">
                  Main Point of Contact
                </TableCell>
                <TableCell className="text-sm font-medium">
                  {data?.house_main_poc_user?.user_first_name}{" "}
                  {data?.house_main_poc_user?.user_last_name}
                </TableCell>
              </TableRow>
              <TableRow className="h-[45px]">
                <TableCell className="text-sm font-medium">
                  Contact Number
                </TableCell>
                <TableCell className="text-sm font-medium">
                  {data?.house_main_poc_user?.contact_number || "N/A"}
                </TableCell>
              </TableRow>
              <TableRow className="h-[45px]">
                <TableCell className="text-sm font-medium">
                  Access Code
                </TableCell>
                {
                  <TableCell className="text-sm font-medium flex items-center gap-2">
                    {!data?.house_code[0]?.code && (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isPending}
                        onClick={() => mutate()}
                      >
                        {isPending ? "Generating..." : "Generate Code"}
                      </Button>
                    )}
                    {data?.house_code[0]?.code && (
                      <p className="text-sm font-medium">
                        {data?.house_code[0]?.code}
                      </p>
                    )}
                    {data?.house_code[0]?.code && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(data?.house_code[0]?.code)}
                      >
                        Copy
                      </Button>
                    )}
                  </TableCell>
                }
              </TableRow>
            </>
          )}
        </TableBody>
      </Table>

      <Separator className="my-8 bg-[#45495A]/[.12]" />

      {/* Vehicles table */}
      {/* <h1 className="font-bold mb-3">Vehicles</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="py-3 px-6 rounded-l-xl text-sm text-nowrap font-bold">
              Name
            </TableHead>
            <TableHead className="py-3 px-6 text-sm text-nowrap font-bold">
              Specification
            </TableHead>
            <TableHead className="py-3 px-6 text-sm text-nowrap font-bold">
              Plate Number
            </TableHead>
            <TableHead className="py-3 px-6 rounded-r-xl text-sm text-nowrap font-bold">
              Sticker Expiration
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehiclesLoading ? (
            Array.from({ length: 2 }, (_, i) => (
              <TableRow
                key={`vehicle-skeleton-${i}`}
                className={i % 2 === 0 ? "" : "bg-white/60"}
              >
                <TableCell colSpan={4}>
                  <Skeleton className="h-8 w-full" />
                </TableCell>
              </TableRow>
            ))
          ) : vehiclesError ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-red-500 py-4">
                Error loading vehicle information
              </TableCell>
            </TableRow>
          ) : vehicles && vehicles.length > 0 ? (
            vehicles.map((vehicle, index) => (
              <TableRow
                key={vehicle.id || index}
                className={cn("h-[45px]", {
                  "bg-white/60": index % 2 === 1,
                })}
              >
                <TableCell className="text-sm font-medium">
                  {vehicle.vehicle_name || "N/A"}
                </TableCell>
                <TableCell className="text-sm font-medium">
                  {vehicle.vehicle_color || "N/A"}
                </TableCell>
                <TableCell className="text-sm font-medium">
                  {vehicle.vehicle_plate_number || "N/A"}
                </TableCell>
                <TableCell className="text-sm font-medium">
                  {vehicle.vehicle_sticker_expiration
                    ? new Date(
                        vehicle.vehicle_sticker_expiration
                      ).toLocaleDateString()
                    : "N/A"}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">
                No vehicles found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table> */}
    </div>
  );
};

export default ResidentDetails;
