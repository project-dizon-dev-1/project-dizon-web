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

  if (houseLoading || vehiclesLoading) {
    return <div>Loading...</div>;
  }

  if (houseError || vehiclesError) {
    return <div>Error loading data</div>;
  }

  return (
    <div>
      <div className="flex gap-3">
        <Icon
          onClick={goBack}
          className="hover:cursor-pointer opacity-75 w-6 h-6"
          icon={"mingcute:arrow-left-line"}
        />
        <h1 className="text-xl font-bold">
          {data?.house_family_name} Family Details
        </h1>
      </div>
      <Separator className="mt-3 mb-8 bg-[#45495A]/[.12]" />
      {/* House details table */}
      <h1 className=" font-bold mb-3">Details</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className=" py-3 px-6 rounded-l-xl text-sm text-nowrap font-bold">
              Property
            </TableHead>
            <TableHead className=" py-3 px-6 rounded-r-xl  text-sm text-nowrap font-bold">
              Value
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="h-[45px]">
            <TableCell className=" text-sm font-medium ">Address</TableCell>
            <TableCell className=" text-sm font-medium ">{` ${data?.house_street} Street, Block ${data?.house_block},Lot ${data?.house_lot}`}</TableCell>
          </TableRow>
          <TableRow className="bg-white/60 h-[45px]">
            <TableCell className="rounded-l-xl text-sm font-medium  ">
              Phase
            </TableCell>
            <TableCell className="rounded-r-xl text-sm font-medium">
              {data?.house_phase}
            </TableCell>
          </TableRow>
          <TableRow className="h-[45px]">
            <TableCell className=" text-sm font-medium ">
              Main Point of Contact
            </TableCell>
            <TableCell className=" text-sm font-medium">
              {data?.house_main_poc}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>{" "}
      <Separator className="my-8 bg-[#45495A]/[.12]" />
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
          {vehicles && vehicles.length > 0 ? (
            vehicles.map((vehicle, index) => (
              <TableRow
                key={vehicle.id || index}
                className={cn("h-[45]", {
                  "bg-white/60 h-[45px]": index + (1 % 2) === 0,
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
