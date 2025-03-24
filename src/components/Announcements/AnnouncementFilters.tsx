import { fetchSubdivisionPhases } from "@/services/subdivisionServices";
import { Skeleton } from "../ui/skeleton";
import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Icon } from "@iconify/react/dist/iconify.js";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { RefObject, useCallback } from "react";

interface AnnouncementFiltersProps {
  containerRef: RefObject<HTMLDivElement>;
}

const AnnouncementFilters = ({ containerRef }: AnnouncementFiltersProps) => {
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

  const totalPopulation =
    phases?.reduce((acc, phase) => acc + phase.total_population, 0) || 0; // Added || 0 to handle undefined phases;

  const clearPhaseFilter = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("phase");
    setSearchParams(newParams);
  };

  // Function to handle scrolling up using the containerRef
  const scrollToTop = useCallback(() => {
    if (containerRef?.current) {
      // Scroll the container to the top
      containerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [containerRef]);

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
          {/* <Icon className="w-5 h-5 " icon="mingcute:add-fill"></Icon> */}
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
              Population: {totalPopulation}
            </p>
          </div>
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="w-full h-14" />
              ))
            : phases?.map((phase, index) => (
                <div
                  onClick={() => setPhaseParams(phase.phase_number.toString())}
                  key={index}
                  className={cn(
                    "w-full pl-[10px] rounded-md py-2 hover:cursor-pointer",
                    {
                      "bg-[#DFF0FF6B] p-4":
                        searchParams.get("phase") ===
                        phase.phase_number.toString(),
                    }
                  )}
                >
                  <h3
                    className={cn(" font-bold text-sm py-[2px] px-2 w-fit ", {
                      "text-[#5B8DCF] rounded-sm bg-[#DEEDFF]":
                        searchParams.get("phase") ===
                        phase.phase_number.toString(),
                    })}
                  >
                    Phase {phase.phase_number}
                  </h3>
                  <p
                    className={cn(" font-medium  text-[12px] pl-2", {
                      "text-[#5B8DCF]":
                        searchParams.get("phase") ===
                        phase.phase_number.toString(),
                    })}
                  >
                    Population: {phase.total_population}
                  </p>
                </div>
              ))}
        </div>
      </div>
      <Button
        className="rounded-xl w-full py-4 h-fit text-default hover:bg-[#DEEDFF] bg-white shadow-none"
        onClick={scrollToTop}
      >
        Scroll Up
      </Button>
    </div>
  );
};

export default AnnouncementFilters;
