import AnnouncementComponent from "@/components/Announcements/AnnouncementComponent";
import AnnouncementFilters from "@/components/Announcements/AnnouncementFilters";
import AnnouncementHeader from "@/components/Announcements/AnnouncementHeader";
import { Skeleton } from "@/components/ui/skeleton";

import useUserContext from "@/hooks/useUserContext";
import { fetchAnnouncements } from "@/services/announcementServices";
import { Announcement } from "@/types/announcementTypes";
import { PaginatedDataType } from "@/types/paginatedType";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";

const Announcements = () => {
  const [searchParams] = useSearchParams();

  const { user } = useUserContext();

  const {
    data,
    isError,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<PaginatedDataType<Announcement>>({
    queryKey: ["announcements", searchParams.get("phase")],
    queryFn: async ({ pageParam }) => {
      const page = pageParam as string;
      return await fetchAnnouncements({
        page,
        pageSize: "20",
        phase: searchParams.get("phase"),
      });
    },
    initialPageParam: "1",
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.hasNextPage) return undefined;
      return lastPage.currentPage + 1;
    },
  });

  if (isError) {
    return <p className="text-red-500">Error loading announcements</p>;
  }

  return (
    <div className="flex justify-center max-h-full h-full gap-12 ">
      {/* Main Content */}
      <div className="  grow flex flex-col overflow-y-scroll max-w-[530px] no-scrollbar">
        <AnnouncementHeader first_name={user?.user_first_name} />
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

        {/* Load More Button */}
        {hasNextPage && (
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="mt-4 px-4 py-2 text-white rounded"
          >
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </button>
        )}

        {/* Filters Sidebar */}
      </div>
      <AnnouncementFilters />
    </div>
  );
};

export default Announcements;
