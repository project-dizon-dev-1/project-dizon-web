import { axiosGet, axiosPost, axiosPut } from "@/lib/axios";
import {
  FetchHouseCollectionQueryParams,
  HouseDetails,
  HouseSummary,
  VehicleDetails,
} from "@/types/HouseTypes";
import { PaginatedDataType } from "@/types/paginatedType";
import { CollectionType } from "@/validations/collectionSchema";
import { HouseSchemaType } from "@/validations/HouseSchema";

const getHouses = async ({
  page,
  query,
  phase,
  street,
  block,
  lot,
}: FetchHouseCollectionQueryParams): Promise<PaginatedDataType<HouseDetails>> => {
  try {
    const params: Record<string, string | undefined | null> = {
      page,
      query,
      phase,
      street,
      block,
      lot,
    };

    // Removing undefined query params
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== undefined)
    );

    return await axiosGet("/houses", { params: filteredParams });
  } catch (error) {
    throw new Error(`Error fetching houses${error}`);
  }
};

const getHousesSummary = async (): Promise<HouseSummary> => {
  return await axiosGet("/houses/summary");
};

const getHouse = async (houseId:string |undefined): Promise<HouseDetails> => {
  return await axiosGet(`/houses/house/${houseId}`);
};
const getHouseVehicle = async (houseId:string |undefined): Promise<VehicleDetails[]> => {
  return await axiosGet(`/houses/${houseId}/vehicles/`);
};

const addHouse = async (data: HouseSchemaType) => {
  return await axiosPost("/houses/add", data);
};

const updateHousePayment = async ({
  houseId,
  data,
}: {
  houseId: string;
  data: CollectionType;
}) => {
  return await axiosPut(`/houses/update/payment/${houseId}`, data);
};

export { getHouses,getHouseVehicle,getHouse, getHousesSummary, updateHousePayment, addHouse };
