import { axiosGet, axiosPut } from "@/lib/axios";
import { House, HouseSummary } from "@/types/HouseTypes";
import { CollectionType } from "@/validations/collectionSchema";





const getHouses = async():Promise<House[]> => {
    return axiosGet("/houses");
};
const getHousesSummary = async():Promise<HouseSummary[]> => {
    return axiosGet("/houses/summary");
};

const updateHousePayment = async({houseId,data}:{houseId:string,data:CollectionType}) => {
     axiosPut(`/houses/update/payment/${houseId}`,data);
};

export {
    getHouses,
    getHousesSummary,
    updateHousePayment
};