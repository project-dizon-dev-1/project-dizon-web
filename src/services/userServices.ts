import { axiosGet } from "@/lib/axios";
import { Database } from "@/types/database";

type User = Database["public"]["Tables"]["users-list"]["Row"]

const getUser = async (userId:string):Promise<User | null> => {
    return axiosGet(`/user/${userId}`);
};


export {getUser};