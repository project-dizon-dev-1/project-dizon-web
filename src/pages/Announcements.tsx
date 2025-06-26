import AnnouncementComponent from "@/components/Announcements/AnnouncementComponent";
import AnnouncementFilters from "@/components/Announcements/AnnouncementFilters";
import AnnouncementHeader from "@/components/Announcements/AnnouncementHeader";
import { Skeleton } from "@/components/ui/skeleton";
import useUserContext from "@/hooks/useUserContext";
import { fetchAnnouncements } from "@/services/announcementServices";

import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useCallback, useRef } from "react";
import { useSearchParams } from "react-router";
import useInterObserver from "@/hooks/useIntersectObserver";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button } from "@/components/ui/button";

const Announcements = () => {
  const { isMobile } = useSidebar();
  const [searchParams] = useSearchParams();
  const { user } = useUserContext();
  const announcementsContainerRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isError,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [
      "announcements",
      user?.role === "resident" ? user.house_phase : searchParams.get("phase"),
    ],
    queryFn: async ({ pageParam }) => {
      const page = pageParam.toString();
      return await fetchAnnouncements({
        page,
        pageSize: "10",
        phase:
          user?.role === "resident"
            ? user.house_phase
            : searchParams.get("phase"),
      });
    },
    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.hasNextPage) return undefined;
      return lastPage.currentPage + 1;
    },
    enabled: !!user,
  });

  // Create callback for intersection observer
  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // Use the intersection observer hook
  const { ref: loadMoreRef } = useInterObserver(handleLoadMore);

  const scrollToTop = useCallback(() => {
    if (announcementsContainerRef?.current) {
      announcementsContainerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [announcementsContainerRef]);

  if (isError) {
    return <p className="text-red-500">Error loading announcements</p>;
  }

  return (
    <div
      ref={announcementsContainerRef}
      className={cn(
        "flex flex-row-reverse justify-center max-h-full h-full gap-12  overflow-y-scroll no-scrollbar",
        {
          " block": isMobile,
        }
      )}
    >
      {/* Main Content */}
      {user?.role === "admin" && (
        <AnnouncementFilters scrollToTop={scrollToTop} />
      )}
      <div className="grow flex flex-col  lg:max-w-[530px]  ">
        {user?.role === "admin" && (
          <AnnouncementHeader first_name={user?.user_first_name} />
        )}

        {/* Announcements List */}
        {!isLoading && data?.pages[0]?.items?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="  ">No announcement yet</p>
            <Icon className="w-96 h-96" icon={"mingcute:paper-fill"} />
          </div>
        ) : null}

        {isLoading
          ? Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="w-full">
                <Skeleton className="mb-2 h-5 w-44" />
                <Skeleton className="mb-2 h-5 w-80" />
                <Skeleton className="mb-2 h-44 w-full" />
              </div>
            ))
          : data?.pages.map((page) =>
              page.items.map(({ announcements }) => (
                <AnnouncementComponent
                  key={announcements.id}
                  announcements={announcements}
                />
              ))
            )}

        {/* Loading indicator */}
        {isFetchingNextPage && (
          <div className="py-4 flex justify-center">
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        )}

        {/* Intersection Observer Target Element */}
        {hasNextPage && (
          <div
            ref={loadMoreRef as React.RefObject<HTMLDivElement>}
            className="h-10"
          />
        )}
      </div>

      {isMobile && (
        <Button
          className={cn(
            "rounded-xl py-4 h-fit text-default hover:bg-[#DEEDFF]  shadow-none absolute bottom-5  right-5 w-14 bg-[#DEEDFF]"
          )}
          onClick={scrollToTop}
        >
          <Icon icon="mingcute:arrow-up-fill" className="mr-1" />
        </Button>
      )}
    </div>
  );
};

export default Announcements;
