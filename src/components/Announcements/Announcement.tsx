import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AnnouncementForm from "./AnnouncementForm";
import { Button } from "../ui/button";
import { useState } from "react";
import { Announcement } from "@/types/announcementTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAnnouncements } from "@/services/announcementServices";
import { toast } from "@/hooks/use-toast";
import { useSearchParams } from "react-router";

const AnnouncementComponent = ({
  announcements,
}: Announcement) => {
  const [searchParams] = useSearchParams();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const deleteAnnouncementMutation = useMutation({
    mutationFn: deleteAnnouncements,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Announcement Deleted",
      });
    },
    onMutate:() => {
      toast({
        title:"Deleting Announcement..."
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
    <div key={announcements.id} className="m-4 p-4 border rounded-lg">
      <div className=" flex justify-between">
        <h2 className="font-semibold text-lg">{announcements.title}</h2>
        <div>
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant={"ghost"}>Edit</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Announcement</DialogTitle>
                <DialogDescription>Edit announcement</DialogDescription>
              </DialogHeader>
              <AnnouncementForm announcement={announcements}  setDialogOpen={setEditDialogOpen} />
            </DialogContent>
          </Dialog>

          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant={"ghost"}>Delete</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Announcement</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this announcement?
                </DialogDescription>
              </DialogHeader>
              <div className=" flex justify-end">
                <Button onClick={closeDeleteDialog} variant={"ghost"}>
                  Cancel
                </Button>
                <Button onClick={handleDelete} variant={"destructive"}>
                  Delete
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="flex text-sm text-gray-500">
        <p className="mr-2">
          {announcements.users_list?.user_first_name} {announcements.users_list?.user_last_name}
        </p>
        <p>
          {new Date(announcements.created_at).toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </p>
      </div>
      <p className="mb-4 whitespace-pre-wrap text-start leading-5 text-accent">
        {announcements.content}
      </p>

        <div className="flex overflow-x-scroll snap-x snap-mandatory">
        {announcements.announcement_files?.map(({url}) => (
     <img key={url} className=" snap-center bg-contain" src={url} alt="an image of announcement" />
))}
        </div>
    </div>
  );
};

export default AnnouncementComponent;
