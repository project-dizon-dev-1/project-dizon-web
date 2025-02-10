import { axiosDelete, axiosGet, axiosPost, axiosPut } from "@/lib/axios";
import { Due, totalDue } from "@/types/DueTypes";
import { dueType } from "@/validations/duesSchema";


const fetchDues = async ():Promise<Due[]> => {
    return axiosGet("/dues/");
};

const fetchTotalDue = async ():Promise<totalDue> => {
    return axiosGet("/dues/total");
};
const addDues = async (data: dueType) => {
    return axiosPost("/dues/add",data);
};
const updateDues = async (dueId:string | undefined,payload:dueType) => {
    return axiosPut(`/dues/update/${dueId}`,payload);
};
const deleteDues = async (dueId:string) => {
    return axiosDelete(`/dues/delete/${dueId}`);
};


export{
    addDues,
    fetchTotalDue,
    fetchDues,
    updateDues,
    deleteDues
};