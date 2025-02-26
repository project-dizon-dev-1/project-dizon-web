import { axiosGet } from "@/lib/axios";

const fetchSubdivisionPhases = async ():Promise<number[]> => {
  return await axiosGet("/subdivision/phases");
};

export { fetchSubdivisionPhases };
