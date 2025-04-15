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
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Card, CardContent } from "../ui/card";
import { toggleComment } from "@/services/commentServices";
import AutoLinkText from "@/lib/AutoLinkText";
import {
  AlertDialog,
  AlertDialogActionNoClose,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

const AnnouncementComponent = ({ announcements }: Announcement) => {
  const [searchParams] = useSearchParams();
  const { user } = useUserContext();
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

  const toggleCommentMutation = useMutation({
    mutationFn: toggleComment,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Comment Disabled",
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: "Error",
        description: "Error disabling comment",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["announcements", searchParams.get("phase")],
      });
    },
  });

  return (
    <div
      key={announcements.id}
      className="py-6 px-8 h-fit bg-white rounded-lg mb-3"
    >
      <div className="flex justify-between items-center mb-3">
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
            <div className="flex items-center"></div>
          </div>
        </div>
        <div>
          {user?.id === announcements.users_list?.id && (
            <Popover>
              <PopoverTrigger>
                <Icon className="w-5 h-5" icon="mingcute:more-1-line" />
              </PopoverTrigger>
              <PopoverContent className="flex flex-col w-fit p-0">
                <Button
                  onClick={() => toggleCommentMutation.mutate(announcements.id)}
                  variant={"ghost"}
                  className="w-full"
                >
                  {announcements.comment_enabled
                    ? "Disable Comment"
                    : "Enable Comment"}
                </Button>
                <AnnouncementForm announcement={announcements}>
                  <Button variant={"ghost"} className="w-full">
                    Edit
                  </Button>
                </AnnouncementForm>

                <AlertDialog
                  open={deleteDialogOpen}
                  onOpenChange={setDeleteDialogOpen}
                >
                  <AlertDialogTrigger asChild>
                    <Button variant={"ghost"} className="shadow-none">
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your announcement.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      <AlertDialogCancel
                        onClick={() => setDeleteDialogOpen(false)}
                        variant={"default"}
                      >
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogActionNoClose
                        variant={"destructive"}
                        onClick={handleDelete}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Delete
                      </AlertDialogActionNoClose>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      <AutoLinkText
        text={announcements.content}
        className="mb-4 whitespace-pre-wrap text-start leading-[18.2px] text-sm"
      />

      <Dialog>
        <DialogTrigger asChild>
          <div className="flex w-full gap-2 justify-center">
            {announcements.announcement_files.length > 0 &&
              announcements.announcement_files[0]?.type?.startsWith(
                "image"
              ) && (
                <div className="flex w-full gap-2">
                  {announcements.announcement_files
                    .slice(0, 3)
                    .map((file, i) => {
                      const isFirst = i === 0;
                      const isLast =
                        i ===
                        Math.min(
                          announcements.announcement_files.length - 1,
                          2
                        );
                      const hasMoreImages =
                        i === 2 && announcements.announcement_files.length > 3;

                      return (
                        <div
                          key={i}
                          className={cn(
                            "flex-1 overflow-hidden rounded-md hover:cursor-pointer",
                            {
                              "rounded-l-xl": isFirst,
                              "rounded-r-xl": isLast,
                              relative: true,
                            }
                          )}
                        >
                          <img
                            className={cn("h-[223px] w-full object-cover", {
                              "opacity-45": hasMoreImages,
                            })}
                            src={file.url}
                            alt="file"
                          />
                          {hasMoreImages && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <p className="text-base font-semibold text-white">
                                +{announcements.announcement_files.length - 3}{" "}
                                more
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
          </div>
        </DialogTrigger>

        {announcements.announcement_files.length > 0 &&
          announcements.announcement_files[0]?.type?.startsWith("video") && (
            <div className="border border-primary-outline">
              <video
                className="h-fit w-full"
                controls
                src={announcements.announcement_files[0]?.url}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}

        {announcements.announcement_files.length > 0 &&
          announcements.announcement_files[0]?.type?.startsWith(
            "application"
          ) && (
            <a
              href={announcements.announcement_files[0]?.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              {`${announcements.announcement_files[0]?.name}.${
                announcements.announcement_files[0].type.split("/")[1]
              }`}
            </a>
          )}

        <DialogContent className="flex h-full w-dvw max-w-none items-center justify-center border-0 bg-transparent">
          <DialogHeader className="sr-only">
            <DialogTitle className="sr-only"></DialogTitle>
            <DialogDescription className="sr-only"></DialogDescription>
          </DialogHeader>
          <Carousel className="w-full max-w-5xl">
            <CarouselContent className="-ml-1">
              {announcements.announcement_files.map((file, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card className="border-none bg-transparent">
                      <CardContent className="flex aspect-square items-center justify-center bg-transparent bg-contain p-6">
                        <img
                          className="h-[100dvh] w-full object-contain"
                          src={file.url}
                          alt="an image of announcement"
                        />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </DialogContent>
      </Dialog>

      <div className="flex items-end justify-between">
        <div className="relative h-5">
          <TriggerLike announcement_id={announcements.id} user_id={user?.id} />
        </div>
      </div>
      <Separator className="mb-4 mt-6 bg-[#BAC1D6]/40" />

      {announcements.comment_enabled ? (
        <Comments announcement_id={announcements?.id} />
      ) : (
        <div className=" flex items-center justify-center">
          <p className=" text-xs text-[#45495A]/50 font-medium">
            Comments are disabled for this announcement.
          </p>
        </div>
      )}
    </div>
  );
};

export default AnnouncementComponent;
