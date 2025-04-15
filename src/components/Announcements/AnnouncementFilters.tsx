import { fetchSubdivisionPhases } from "@/services/subdivisionServices";
import { Skeleton } from "../ui/skeleton";
import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Icon } from "@iconify/react/dist/iconify.js";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { RefObject, useCallback } from "react";

// Define the Phase type based on the new structure
interface Phase {
  phase_id: string | null;
  phase_name: string;
  total_population: number;
}

interface AnnouncementFiltersProps {
  containerRef: RefObject<HTMLDivElement>;
}

const AnnouncementFilters = ({ containerRef }: AnnouncementFiltersProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPhaseId = searchParams.get("phase");

  const {
    data: phases,
    isLoading,
    isError,
  } = useQuery<Phase[]>({
    queryKey: ["phasesfilter"],
    queryFn: fetchSubdivisionPhases,
  });

  const setPhaseParams = (phaseId: string | null) => {
    if (!phaseId) return;

    // Use phase_id as the parameter value while keeping the parameter name as "phase"
    setSearchParams({ phase: phaseId });
  };

  const totalPopulation =
    phases?.reduce((acc, phase) => acc + phase.total_population, 0) || 0;

  const clearPhaseFilter = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("phase");
    setSearchParams(newParams);
  };

  const scrollToTop = useCallback(() => {
    if (containerRef?.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [containerRef]);

  if (isError) {
    return <p className="text-red-500">Failed to load phases</p>;
  }

  // Generate skeleton items for loading state
  const skeletonItems = Array.from({ length: 5 }, (_, i) => (
    <div key={`skeleton-${i}`} className="w-full px-[10px] py-2">
      <Skeleton className="h-6 w-3/4 mb-1" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  ));

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex flex-col max-h-96 overflow-y-scroll w-[226px] max-w-[226px] bg-white rounded-md">
        <div className="flex justify-between py-4 pl-7 pr-[21px]">
          <div className="flex items-center gap-1">
            <Icon className="w-5 h-5" icon="mingcute:house-2-fill" />
            <h1 className="font-bold text-sm">Phases</h1>
          </div>
        </div>

        <Separator className="bg-[#BAC1D6]/40" />
        <div className="py-2 px-[14px] space-y-[2px]">
          {/* Always show the "All" option */}
          <div
            onClick={clearPhaseFilter}
            className={cn(
              "w-full pl-[10px] rounded-md py-2 hover:cursor-pointer",
              {
                "bg-[#DFF0FF6B] p-4": currentPhaseId === null,
              }
            )}
          >
            <h3
              className={cn("font-bold text-sm py-[2px] px-2 w-fit", {
                "text-[#5B8DCF] rounded-sm bg-[#DEEDFF]":
                  currentPhaseId === null,
              })}
            >
              All
            </h3>
            <p
              className={cn("font-medium text-[12px] pl-2", {
                "text-[#5B8DCF]": currentPhaseId === null,
              })}
            >
              Population: {isLoading ? "..." : totalPopulation}
            </p>
          </div>

          {/* Conditionally render based on loading state */}
          {isLoading ? (
            // Show skeletons while loading
            skeletonItems
          ) : phases && phases.length > 0 ? (
            // Show phases if available - directly map the phases array
            phases
              .filter(
                (phase) => phase.phase_id && phase.phase_name.trim() !== ""
              )
              .map((phase) => (
                <div
                  onClick={() => setPhaseParams(phase.phase_id)}
                  key={phase.phase_id || `phase-${phase.phase_name}`}
                  className={cn(
                    "w-full pl-[10px] rounded-md py-2 hover:cursor-pointer",
                    {
                      "bg-[#DFF0FF6B] p-4": currentPhaseId === phase.phase_id,
                    }
                  )}
                >
                  <h3
                    className={cn("font-bold text-sm py-[2px] px-2 w-fit", {
                      "text-[#5B8DCF] rounded-sm bg-[#DEEDFF]":
                        currentPhaseId === phase.phase_id,
                    })}
                  >
                    {phase.phase_name}
                  </h3>
                  <p
                    className={cn("font-medium text-[12px] pl-2", {
                      "text-[#5B8DCF]": currentPhaseId === phase.phase_id,
                    })}
                  >
                    Population: {phase.total_population}
                  </p>
                </div>
              ))
          ) : (
            // Show a message when no phases are available
            <div className="text-center py-4 text-gray-500">
              No phases available
            </div>
          )}
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
