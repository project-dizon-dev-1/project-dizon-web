import { fetchSubdivisionPhases } from "@/services/subdivisionServices";
import { Skeleton } from "../ui/skeleton";
import { useSearchParams } from "react-router";
import {  useQuery } from "@tanstack/react-query";


const AnnouncementFilters = () => {
    const [ _searchParams, setSearchParams] = useSearchParams();
  
    const {
      data: phases,
      isLoading,
      isError,
    } = useQuery({
      queryKey: ["phases"],
      queryFn: fetchSubdivisionPhases,
    });
    const setPhaseParams = (phase:string) => {
        setSearchParams({phase});
        
    };


    if (isLoading) {
      return (
        <div className="flex flex-col gap-2">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="w-full h-20" />
          ))}
        </div>
      );
    }
  
    if (isError) {
      return <p className="text-red-500">Failed to load phases</p>;
    }


  
    return (
      <div className="flex flex-col gap-2">
        {phases?.map((phase, index) => (
          <div onClick={() => setPhaseParams(phase.toString())} key={index} className="w-full rounded-md border border-black h-20 flex items-center p-4 hover:cursor-pointer">
            <h3 className="text-start">Phase {phase}</h3>
          </div>
        ))}
      </div>
    );
  };
  
  export default AnnouncementFilters;
  