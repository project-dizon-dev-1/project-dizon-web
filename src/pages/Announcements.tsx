import AnnouncementComponent from "@/components/Announcements/AnnouncementComponent";
import AnnouncementFilters from "@/components/Announcements/AnnouncementFilters";
import AnnouncementHeader from "@/components/Announcements/AnnouncementHeader";
import { Skeleton } from "@/components/ui/skeleton";
import useUserContext from "@/hooks/useUserContext";
import { fetchAnnouncements } from "@/services/announcementServices";
import { Announcement } from "@/types/announcementTypes";
import { PaginatedDataType } from "@/types/paginatedType";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useRef } from "react";
import { useSearchParams } from "react-router";
import useInterObserver from "@/hooks/useIntersectObserver";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

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
  } = useInfiniteQuery<PaginatedDataType<Announcement>>({
    queryKey: [
      "announcements",
      user?.role === "resident" ? user.house_phase : searchParams.get("phase"),
    ],
    queryFn: async ({ pageParam }) => {
      const page = pageParam as string;
      return await fetchAnnouncements({
        page,
        pageSize: "10",
        phase:
          user?.role === "resident"
            ? user.house_phase
            : searchParams.get("phase"),
      });
    },
    initialPageParam: "1",
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

  if (isError) {
    return <p className="text-red-500">Error loading announcements</p>;
  }

  return (
    <div
      className={cn("flex justify-center max-h-full h-full gap-12 ", {
        "flex-col-reverse overflow-y-scroll gap-4 w-full no-scrollbar":
          isMobile,
      })}
    >
      {/* Main Content */}
      <div
        ref={announcementsContainerRef}
        className="grow flex flex-col overflow-y-scroll lg:max-w-[530px] no-scrollbar "
      >
        {user?.role === "admin" && (
          <AnnouncementHeader first_name={user?.user_first_name} />
        )}

        {/* Announcements List */}
        {!isLoading && data?.pages[0]?.items?.length === 0 ? (
          <p>No announcement yet</p>
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

      {user?.role === "admin" && (
        <AnnouncementFilters containerRef={announcementsContainerRef} />
      )}
    </div>
  );
};

export default Announcements;
