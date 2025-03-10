import AnnouncementForm from "./AnnouncementForm";
import { Button } from "../ui/button";
import { useState } from "react";
import { Announcement } from "@/types/announcementTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAnnouncements } from "@/services/announcementServices";
import { toast } from "@/hooks/use-toast";
import { useSearchParams } from "react-router";
import { Icon } from "@iconify/react/dist/iconify.js";
import useUserContext from "@/hooks/useUserContext";
import { Separator } from "../ui/separator";
import Comments from "../Comments/Comments";
import TriggerLike from "../Comments/TriggerLike";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

const AnnouncementComponent = ({ announcements }: Announcement) => {
  const [searchParams] = useSearchParams();
  const { user } = useUserContext();
  // const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const deleteAnnouncementMutation = useMutation({
    mutationFn: deleteAnnouncements,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Announcement Deleted",
      });
    },
    onMutate: () => {
      toast({
        title: "Deleting Announcement...",
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: "Error",
        description: "Error deleting announcement",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["announcements", searchParams.get("phase")],
      });
    },
  });

  const handleDelete = () => {
    setDeleteDialogOpen(false);
    deleteAnnouncementMutation.mutate(announcements.id);
  };

  // console.log(announcements.announcement_files)

  return (
    <div
      key={announcements.id}
      className="py-6  px-8  h-fit bg-white rounded-lg mb-3"
    >
      <div className=" flex justify-between items-center mb-3">
        <div>
          <h2 className="font-bold text-[16px]">{announcements.title}</h2>
          <div className="flex items-center text-sm text-gray-500 gap-2">
            <p className="mr-2 font-bold text-[12px]">
              {announcements.users_list?.user_first_name}{" "}
              {announcements.users_list?.user_last_name}
            </p>
            <p className="text-[12px]">
              {new Date(announcements.created_at).toLocaleString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </p>
            <div className=" flex items-center">
              <Icon
                className=" w-[14px] h-[14px]"
                icon="mingcute:house-2-fill"
              />
              <p>{searchParams.get("phase")}</p>
            </div>
          </div>
        </div>
        <div>
          <Popover>
            <PopoverTrigger>
              <Icon className="w-5 h-5" icon="mingcute:more-1-line" />
            </PopoverTrigger>
            <PopoverContent className="flex flex-col w-fit p-0">
              <AnnouncementForm announcement={announcements}>
                <Button variant={"ghost"} className="w-full">
                  Edit
                </Button>
              </AnnouncementForm>

              <Dialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant={"ghost"} className="shadow-none">
                    Delete
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex gap-2 ">
                    <Button
                      onClick={() => setDeleteDialogOpen(false)}
                      className=" flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleDelete}
                      variant="destructive"
                      className="flex-1"
                    >
                      Delete
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <p className="mb-4 whitespace-pre-wrap text-start leading-[18.2px] text-sm">
        {announcements.content}
      </p>

      <div className="flex overflow-x-scroll snap-x snap-mandatory">
        {announcements.announcement_files?.map(({ url }) => (
          <img
            key={url}
            className=" snap-center bg-contain"
            src={url}
            alt="an image of announcement"
          />
        ))}
      </div>

      <div className="flex items-end justify-between">
        <div className="relative h-5">
          <TriggerLike announcement_id={announcements.id} user_id={user?.id} />
        </div>
      </div>
      <Separator className="mb-4 mt-6 bg-[#BAC1D6]/40" />

      <Comments announcement_id={announcements?.id} />
    </div>
  );
};

export default AnnouncementComponent;
