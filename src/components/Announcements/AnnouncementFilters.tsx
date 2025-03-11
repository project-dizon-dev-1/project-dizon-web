import { fetchSubdivisionPhases } from "@/services/subdivisionServices";
import { Skeleton } from "../ui/skeleton";
import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Icon } from "@iconify/react/dist/iconify.js";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";

const AnnouncementFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    data: phases,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["phases"],
    queryFn: fetchSubdivisionPhases,
  });
  const setPhaseParams = (phase: string) => {
    setSearchParams({ phase });
  };

  const clearPhaseFilter = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("phase");
    setSearchParams(newParams);
  };

  if (isError) {
    return <p className="text-red-500">Failed to load phases</p>;
  }

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex flex-col max-h-96 overflow-y-scroll w-[226px] max-w-[226px] bg-white rounded-md">
        <div className=" flex justify-between py-4 pl-7 pr-[21px]">
          <div className="flex items-center gap-1">
            <Icon className="w-5 h-5" icon="mingcute:house-2-fill" />
            <h1 className=" font-bold text-sm">Phases</h1>
          </div>
          <Icon className="w-5 h-5 " icon="mingcute:add-fill"></Icon>
        </div>

        <Separator className=" bg-[#BAC1D6]/40" />
        <div className=" py-2 px-[14px] space-y-[2px]">
          <div
            onClick={clearPhaseFilter}
            className={cn(
              "w-full pl-[10px] rounded-md py-2 hover:cursor-pointer",
              {
                "bg-[#DFF0FF6B] p-4": searchParams.get("phase") === null,
              }
            )}
          >
            <h3
              className={cn(" font-bold text-sm py-[2px] px-2 w-fit ", {
                "text-[#5B8DCF] rounded-sm bg-[#DEEDFF]":
                  searchParams.get("phase") === null,
              })}
            >
              All
            </h3>
            <p
              className={cn(" font-medium  text-[12px] pl-2", {
                "text-[#5B8DCF]": searchParams.get("phase") === null,
              })}
            >
              Population: 100
            </p>
          </div>
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="w-full h-14" />
              ))
            : phases?.map((phase, index) => (
                <div
                  onClick={() => setPhaseParams(phase.toString())}
                  key={index}
                  className={cn(
                    "w-full pl-[10px] rounded-md py-2 hover:cursor-pointer",
                    {
                      "bg-[#DFF0FF6B] p-4":
                        searchParams.get("phase") === phase.toString(),
                    }
                  )}
                >
                  <h3
                    className={cn(" font-bold text-sm py-[2px] px-2 w-fit ", {
                      "text-[#5B8DCF] rounded-sm bg-[#DEEDFF]":
                        searchParams.get("phase") === phase.toString(),
                    })}
                  >
                    Phase {phase}
                  </h3>
                  <p
                    className={cn(" font-medium  text-[12px] pl-2", {
                      "text-[#5B8DCF]":
                        searchParams.get("phase") === phase.toString(),
                    })}
                  >
                    Population: 100
                  </p>
                </div>
              ))}
        </div>
      </div>
      <Button className=" rounded-xl w-full py-4 h-fit text-default hover:bg-[#DEEDFF] bg-white shadow-none">
        Scroll Up
      </Button>
    </div>
  );
};

export default AnnouncementFilters;
