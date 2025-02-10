import { axiosGet } from "@/lib/axios";
import { Database } from "@/types/database";



type House = Database["public"]["Tables"]["house-list"]["Row"];

const getHouses = async():Promise<House[]> => {
    return axiosGet("/houses");
};

export {
    getHouses
};