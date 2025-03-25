import { Separator } from "@/components/ui/separator";
import { getHouse, getHouseVehicle } from "@/services/houseServices";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const ResidentDetails = () => {
  const { houseId } = useParams();
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  const {
    data,
    isLoading: houseLoading,
    isError: houseError,
  } = useQuery({
    queryKey: ["house", houseId],
    queryFn: async () => await getHouse(houseId),
  });

  const {
    data: vehicles,
    isLoading: vehiclesLoading,
    isError: vehiclesError,
  } = useQuery({
    queryKey: ["vehicle", houseId],
    queryFn: async () => await getHouseVehicle(houseId),
  });

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
            `${data?.house_family_name} Family Details`
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
            // Skeleton rows for house details - simpler approach like in Residents
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
                <TableCell className="text-sm font-medium">{` ${data?.house_street} Street, Block ${data?.house_block}, Lot ${data?.house_lot}`}</TableCell>
              </TableRow>
              <TableRow className="bg-white/60 h-[45px]">
                <TableCell className="rounded-l-xl text-sm font-medium">
                  Phase
                </TableCell>
                <TableCell className="rounded-r-xl text-sm font-medium">
                  {data?.house_phase}
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
            </>
          )}
        </TableBody>
      </Table>

      <Separator className="my-8 bg-[#45495A]/[.12]" />

      {/* Vehicles table */}
      <h1 className="font-bold mb-3">Vehicles</h1>
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
            // Skeleton rows for vehicles - simpler approach like in Residents
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
      </Table>
    </div>
  );
};

export default ResidentDetails;
