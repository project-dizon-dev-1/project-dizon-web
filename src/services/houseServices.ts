import { axiosGet, axiosPost, axiosPut } from "@/lib/axios";
import {
  FetchHouseCollectionQueryParams,
  HouseData,
  HouseDetails,
  HousesSummary,
  HouseSummary,
  VehicleDetails,
} from "@/types/HouseTypes";
import { PaginatedDataType } from "@/types/paginatedType";
import { CollectionType } from "@/validations/collectionSchema";
import { HouseSchemaType } from "@/validations/residentSchema";

const getHouses = async ({
  page,
  query,
  phase,
  street,
  block,
  lot,
}: FetchHouseCollectionQueryParams): Promise<
  PaginatedDataType<HouseDetails>
> => {
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

const getHousesSummary = async (): Promise<HousesSummary> => {
  return await axiosGet("/houses/summary");
};
const getHouseSummary = async (
  houseId: string | undefined | null
): Promise<HouseSummary> => {
  return await axiosGet(`/houses/summary/${houseId}`);
};

const getHouse = async (
  houseId: string | undefined | null
): Promise<HouseData> => {
  return await axiosGet(`/houses/house/${houseId}`);
};
const getHouseVehicle = async (
  houseId: string | undefined
): Promise<VehicleDetails[]> => {
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
  const formData = new FormData();

  // Add regular data fields
  formData.append(
    "houseLatestPaymentAmount",
    data.houseLatestPaymentAmount.toString()
  );
  formData.append("housePaymentMonths", data.housePaymentMonths.toString());

  if (data.housePaymentRemarks) {
    formData.append("housePaymentRemarks", data.housePaymentRemarks);
  }

  // Add file if it exists
  if (data.paymentProof instanceof File) {
    formData.append("paymentProof", data.paymentProof);
  }
  return await axiosPut(`/houses/update/payment/${houseId}`, formData);
};

const approveCollection = async ({
  dueId,
  userId,
}: {
  dueId: string | undefined;
  userId: string | undefined;
}) => {
  return await axiosPut(`/houses/${dueId}/confirm`, { userId });
};

export {
  getHouses,
  getHouseVehicle,
  getHouse,
  getHousesSummary,
  updateHousePayment,
  addHouse,
  approveCollection,
  getHouseSummary,
};
