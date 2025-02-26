import AnnouncementComponent from "@/components/Announcements/Announcement";
import AnnouncementFilters from "@/components/Announcements/AnnouncementFilters";
import AnnouncementForm from "@/components/Announcements/AnnouncementForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { fetchAnnouncements } from "@/services/announcementServices";
import { Announcement } from "@/types/announcementTypes";
import { PaginatedDataType } from "@/types/paginatedType";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "react-router";

const Announcements = () => {
  const [searchParams] = useSearchParams();
  const [dialogOpen, setDialogOpen] = useState(false);

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
    <div className="flex flex-col max-h-full p-4 ">
      {/* Header */}
      <div className="flex w-3/4 justify-between">
        <h1 className="font-bold text-3xl mb-5">Announcements</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create Announcement</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Announcement</DialogTitle>
              <DialogDescription>Create a new announcement</DialogDescription>
            </DialogHeader>
            <AnnouncementForm setDialogOpen={setDialogOpen} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Main Content */}
      <div className=" gap-2 grow flex overflow-hidden">
        {/* Announcements List */}
        <div className="w-3/4 border border-black rounded-md p-4 overflow-y-scroll no-scrollbar">
          {!isLoading && data?.pages[0]?.items?.length === 0 ? (
            <p>No announcement yet</p>
          ) : null}

          {isLoading ? (
            <p>Loading...</p>
          ) : (
            data?.pages.map((page) =>
              page.items.map(({ announcements }) => (
                <AnnouncementComponent key={announcements.id}  announcements={announcements} />
              ))
            )
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
        </div>

        {/* Filters Sidebar */}
        <div className="w-1/4 border rounded-md p-5 border-black">
          <AnnouncementFilters />
        </div>
      </div>
    </div>
  );
};

export default Announcements;
