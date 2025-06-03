import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogBody,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import {
  announcementSchema,
  AnnouncementSchemaType,
} from "@/validations/announcementSchema";
import React, { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useUserContext from "@/hooks/useUserContext";
import {
  addAnnouncement,
  editAnnouncement,
  fetchAnnouncementPhases,
} from "@/services/announcementServices";
import { toast } from "@/hooks/use-toast";
import { Announcement } from "@/types/announcementTypes";
import CustomReactSelect from "../CustomReactSelect";
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Label } from "../ui/label";
import { usePhaseContext } from "@/context/phaseContext";
import { Phase } from "@/types/subdivisionTypes";
import ImageLoader from "@/lib/ImageLoader";

const AnnouncementForm = ({
  announcement,
  children,
}: {
  announcement?: Announcement["announcements"];
  children: React.ReactNode;
}) => {
  const announcementFileType =
    announcement?.announcement_files[0]?.type.startsWith("application")
      ? "Document"
      : announcement?.announcement_files[0]?.type.startsWith("video")
      ? "Video"
      : announcement?.announcement_files[0]?.type.startsWith("image")
      ? "Image(s)"
      : "None";

  const { phases } = usePhaseContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentFiles, setCurrentFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedFileType, setSelectedFileType] = useState(
    announcementFileType ?? "None"
  );
  const queryClient = useQueryClient();
  const { user } = useUserContext();

  const fileTypes = [
    { icon: "minus-circle-fill", value: "None" },
    { icon: "photo-album-fill", value: "Image(s)" },
    { icon: "video-fill", value: "Video" },
    { icon: "attachment-fill", value: "Document" },
  ];

  // Query for fetching announcement phases with loading and error states
  const {
    data: formPhases,
    isLoading: isPhaseLoading,
    isError: isPhaseError,
  } = useQuery({
    queryKey: ["announcementphases", announcement?.id],
    queryFn: () => fetchAnnouncementPhases(announcement?.id),
    enabled: !!announcement?.id,
  });

  const form = useForm<AnnouncementSchemaType>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: announcement?.title ?? "",
      content: announcement?.content ?? "",
      phases: [],
      files: [],
    },
  });

  const addAnnouncementMutation = useMutation({
    mutationFn: addAnnouncement,
    onMutate: () => {
      setDialogOpen(false);
      toast({
        title: "Adding Announcement... ",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `${error.message}`,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Announcement added",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["announcements"],
      });
      form.reset();
      setCurrentFiles([]);
      setFilePreviews([]);
      setSelectedDocument(null);
      setSelectedVideo(null);
      setSelectedFileType("None");
      // Reset input value to allow re-uploading the same file
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
  });

  const editAnnouncementMutation = useMutation({
    mutationFn: editAnnouncement,
    onMutate: () => {
      setDialogOpen(false);
      toast({
        title: "Adding Announcement... ",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Error editing announcement",
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Announcement edited",
      });
      setDialogOpen(false);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["announcements"],
      });
    },
  });

  const phaseOptions = phases?.map((phase: Phase) => ({
    label: phase.name,
    value: phase.id,
  }));

  // Set phases once formPhases are loaded
  useEffect(() => {
    if (formPhases && formPhases.length > 0) {
      const formPhasesId = formPhases.map((phase) => phase.id);
      form.setValue("phases", formPhasesId);
    }
  }, [formPhases, form, dialogOpen]);

  // Load files for editing
  useEffect(() => {
    if (!dialogOpen) return; // Don't load files if dialog is closed

    const urlToFile = async (url: string, filename: string): Promise<File> => {
      const response = await fetch(url);
      const blob = await response.blob();
      return new File([blob], filename, { type: blob.type });
    };

    const fetchFiles = async () => {
      if (announcement?.announcement_files) {
        const files = await Promise.all(
          announcement.announcement_files.map((file) =>
            urlToFile(file.url, file.name)
          )
        );
        form.setValue("files", files);
        setCurrentFiles(files);
        setFilePreviews(files.map((file) => URL.createObjectURL(file)));
      }
    };

    // load video
    if (announcement?.announcement_files?.[0]?.type.startsWith("video")) {
      setSelectedVideo(announcement?.announcement_files[0]?.url);
    }
    // load document
    if (announcement?.announcement_files?.[0]?.type.startsWith("application")) {
      setSelectedDocument(announcement?.announcement_files[0]?.url);
    }

    fetchFiles();
  }, [announcement, form, dialogOpen]);

  const handleRemoveFile = (index: number) => {
    const updatedFiles =
      form.getValues("files")?.filter((_, i) => i !== index) || [];

    // Update files in the form state
    form.setValue("files", updatedFiles);
    setCurrentFiles(updatedFiles);

    // Update filePreviews state
    setFilePreviews((prev) => prev.filter((_, i) => i !== index));
    //set the right image for inputref
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const onSubmit = (values: AnnouncementSchemaType) => {
    const formData = new FormData();

    formData.append("title", values.title);
    formData.append("content", values.content);

    const phasesToSubmit = Array.isArray(values.phases) ? values.phases : [];
    formData.append("phases", JSON.stringify(phasesToSubmit));

    values?.files?.map((file) => {
      formData.append("files", file);
    });

    if (announcement) {
      editAnnouncementMutation.mutate({
        announcementId: announcement?.id,
        data: formData,
      });
    } else {
      addAnnouncementMutation.mutate({ userId: user?.id, data: formData });
    }
  };

  // Improved URL cleanup function
  const revokeObjectURLs = () => {
    // Cleanup all image preview URLs
    filePreviews.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error revoking object URL:", error);
      }
    });

    // Cleanup PDF URL if exists
    if (selectedDocument) {
      try {
        URL.revokeObjectURL(selectedDocument);
      } catch (error) {
        console.error("Error revoking PDF URL:", error);
      }
    }

    // Cleanup Video URL if exists
    if (selectedVideo) {
      try {
        URL.revokeObjectURL(selectedVideo);
      } catch (error) {
        console.error("Error revoking video URL:", error);
      }
    }
  };

  // Improved dialog close handler with complete cleanup
  const handleCloseDialog = () => {
    // Revoke all object URLs first
    revokeObjectURLs();

    // Reset all state
    setDialogOpen(false);
    setCurrentFiles([]);
    setFilePreviews([]);
    setSelectedDocument(null);
    setSelectedVideo(null);
    setSelectedFileType(announcement?.announcement_files ? "Image(s)" : "None");
    form.reset();
    //reset input value to allow re-uploading the same file
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  // Add useEffect cleanup on component unmount
  useEffect(() => {
    // Cleanup function that runs when component unmounts
    return () => {
      revokeObjectURLs();
    };
  }, []); // Empty dependency array means this runs on unmount only

  // Modify file type change handler to properly cleanup URLs
  const handleFileTypeChange = (newType: string) => {
    // Clean up existing URLs first
    revokeObjectURLs();

    // Reset states
    setFilePreviews([]);
    setCurrentFiles([]);
    setSelectedDocument(null);
    setSelectedVideo(null);
    setSelectedFileType(newType);
    form.setValue("files", []);
  };

  // Handle opening the dialog
  const handleOpenDialog = () => {
    // For new announcements, we can open immediately
    if (!announcement) {
      setDialogOpen(true);
      return;
    }

    // For editing, trigger the dialog to open which will start the phase fetching
    setDialogOpen(true);
  };

  return (
    <AlertDialog
      open={dialogOpen}
      onOpenChange={(open) => {
        if (open) {
          handleOpenDialog();
        } else {
          handleCloseDialog();
        }
      }}
    >
      <AlertDialogTrigger asChild className="w-full" onClick={handleOpenDialog}>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent className="max-h-[80%] w-full overflow-y-scroll no-scrollbar">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {announcement ? "Edit Announcement" : "Create Announcement"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {announcement
              ? "Update this announcement."
              : "Create an announcement to be displayed to the residents."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Show loading state while phases are being fetched */}
        {announcement && isPhaseLoading ? (
          <AlertDialogBody className="flex justify-center items-center min-h-[300px]">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>
                  <div
                    className="absolute top-0 left-0 h-12 w-12 rounded-full border-t-4 border-b-4 border-blue-200 animate-spin"
                    style={{
                      animationDirection: "reverse",
                      animationDuration: "1.5s",
                    }}
                  ></div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Loading announcement data...
              </p>
            </div>
          </AlertDialogBody>
        ) : isPhaseError ? (
          <AlertDialogBody className="flex justify-center items-center min-h-[200px]">
            <div className="text-center space-y-2">
              <Icon
                icon="mingcute:warning-fill"
                className="h-12 w-12 text-amber-500 mb-2"
              />
              <p className="text-sm text-red-500">
                Error loading announcement data.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDialogOpen(false)}
              >
                Close
              </Button>
            </div>
          </AlertDialogBody>
        ) : (
          <AlertDialogBody>
            <Form {...form}>
              <form
                id="form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2"
              >
                <div className="rounded-xl border border-primary-outline bg-[#DFF0FF6B] p-6 py-[18px]">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            className="rounded-none shadow-none border-none bg-transparent p-0 font-bold placeholder:text-[16px]"
                            placeholder="Announcement Title"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Separator />

                  {/* Content Field */}
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            className="no-scrollbar shadow-none resize-none rounded-none border-none bg-transparent p-0 placeholder:text-sm"
                            placeholder="Announcement body..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  {form.formState.errors.title && (
                    <p className="text-sm font-medium text-red-500">
                      {form.formState.errors.title.message}
                    </p>
                  )}
                  {form.formState.errors.content && (
                    <p className="text-sm font-medium text-red-500">
                      {form.formState.errors.content.message}
                    </p>
                  )}
                </div>

                {/* File Upload Section */}
                <FormField
                  control={form.control}
                  name="files"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <>
                          <Input
                            id="file-input"
                            type="file"
                            className="hidden"
                            ref={inputRef}
                            accept={
                              selectedFileType === "Image(s)"
                                ? "image/*"
                                : selectedFileType === "Video"
                                ? "video/*"
                                : "application/*"
                            }
                            multiple={selectedFileType === "Image(s)"}
                            onChange={(e) => {
                              const files = e.target.files;

                              if (files && files.length > 0) {
                                if (selectedFileType === "Image(s)") {
                                  field.onChange([
                                    ...currentFiles,
                                    ...Array.from(files),
                                  ]);
                                  setCurrentFiles((prevState) => [
                                    ...prevState,
                                    ...Array.from(files),
                                  ]);

                                  const fileArray = Array.from(files);
                                  setFilePreviews((prevState) => [
                                    ...prevState,
                                    ...fileArray.map((item) =>
                                      URL.createObjectURL(item)
                                    ),
                                  ]);
                                  //reset input value to allow re-uploading the same file
                                  if (inputRef.current) {
                                    inputRef.current.value = "";
                                  }
                                } else {
                                  revokeObjectURLs();

                                  const file = files[0];
                                  const url = URL.createObjectURL(file);

                                  if (file.type.startsWith("application")) {
                                    setSelectedDocument(url);
                                  } else {
                                    setSelectedVideo(url);
                                  }

                                  form.setValue("files", [file]);
                                }
                              }
                            }}
                          />

                          <div className="max-w-full space-y-2 rounded-xl border border-primary-outline bg-[#DFF0FF6B] px-6 pb-[12px] pt-[16px]">
                            <p className="text-[12px]">
                              <span className="font-bold">Attachment:</span>{" "}
                              {selectedFileType}
                            </p>
                            <div className="flex gap-2">
                              {fileTypes.map(({ icon, value }, index) => (
                                <div
                                  key={index}
                                  onClick={() => handleFileTypeChange(value)}
                                  className={cn(
                                    "rounded-xl bg-[#DEEDFF] px-[14px] py-[6px] hover:cursor-pointer",
                                    { "bg-white": selectedFileType === value }
                                  )}
                                >
                                  <Icon
                                    className={cn("h-5 w-5", {
                                      "": selectedFileType === value,
                                    })}
                                    icon={`mingcute:${icon}`}
                                  />
                                </div>
                              ))}
                            </div>
                            <Separator />

                            {selectedFileType === "Image(s)" && (
                              <div className="flex max-h-[110px] w-full max-w-[420px] gap-3 overflow-x-scroll">
                                {filePreviews.map((url, index) => (
                                  <div
                                    key={index}
                                    className="relative flex justify-center h-[100px] w-[100px] flex-shrink-0 rounded-md"
                                  >
                                    <ImageLoader
                                      className="object-cover w-full h-full rounded-md"
                                      src={url}
                                      alt="an image"
                                    />
                                    <Icon
                                      onClick={() => handleRemoveFile(index)}
                                      className="absolute right-1 top-1 text-xl hover:cursor-pointer text-red-300"
                                      icon={"mingcute:close-circle-fill"}
                                    />
                                  </div>
                                ))}
                                <Label htmlFor="file-input">
                                  <div className="flex h-[100px] w-[100px] flex-shrink-0 items-center justify-center rounded-md border border-primary-outline bg-[#DEEDFF] hover:cursor-pointer">
                                    <Icon
                                      className="h-9 w-9"
                                      icon={"mingcute:add-line"}
                                    />
                                  </div>
                                </Label>
                              </div>
                            )}

                            {selectedFileType === "Video" &&
                              (selectedVideo ? (
                                <div className="flex items-center justify-center w-full aspect-video overflow-hidden">
                                  <div className="flex  items-center justify-center relative h-full aspect-video flex-shrink-0">
                                    <video
                                      className="h-full rounded-lg object-contain"
                                      controls={true}
                                      src={selectedVideo}
                                    />
                                    <Icon
                                      onClick={() => {
                                        setSelectedVideo(null);
                                        form.setValue("files", []);
                                        if (inputRef.current) {
                                          inputRef.current.value = "";
                                        }
                                      }}
                                      className="absolute right-1 top-1 text-xl hover:cursor-pointer text-red-300"
                                      icon={"mingcute:close-circle-fill"}
                                    />
                                  </div>
                                </div>
                              ) : (
                                <Label htmlFor="file-input">
                                  <div className="flex h-[110px] flex-col items-center justify-center hover:cursor-pointer">
                                    <div className="flex flex-shrink-0 items-center justify-center rounded-md">
                                      <Icon
                                        className="h-11 w-11 text-[#DEEDFF]"
                                        icon={"mingcute:video-fill"}
                                      />
                                    </div>
                                    <p className="text-[12px] font-semibold text-[#DEEDFF]">
                                      Upload Video
                                    </p>
                                  </div>
                                </Label>
                              ))}

                            {selectedFileType === "Document" &&
                              (selectedDocument ? (
                                <div className="flex  justify-center items-center">
                                  <div className="flex justify-center border border-[#DEEDFF] items-center flex-col relative h-[100px] w-[200px]  rounded-md">
                                    <Icon
                                      className="h-11 w-11 text-[#DEEDFF]"
                                      icon={"mingcute:attachment-fill"}
                                    />
                                    <Icon
                                      onClick={() => {
                                        setSelectedDocument(null);
                                        if (inputRef.current) {
                                          inputRef.current.value = "";
                                        }
                                      }}
                                      className="absolute right-1 top-1 text-xl hover:cursor-pointer text-red-300"
                                      icon={"mingcute:close-circle-fill"}
                                    />
                                    <p className="text-xs text-center text-[#DEEDFF]">
                                      {form.getValues("files")?.[0]?.name}
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                <Label htmlFor="file-input">
                                  <div className="flex h-[100px] w-full  flex-col items-center justify-center hover:cursor-pointer">
                                    <div className="flex flex-shrink-0 items-center justify-center rounded-md">
                                      <Icon
                                        className="h-11 w-11 text-[#DEEDFF]"
                                        icon={"mingcute:attachment-fill"}
                                      />
                                    </div>
                                    <p className="text-[12px] font-semibold text-[#DEEDFF]">
                                      Upload Document
                                    </p>
                                  </div>
                                </Label>
                              ))}
                          </div>
                        </>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phases"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phases</FormLabel>
                      <FormControl>
                        <CustomReactSelect
                          showSelectAll={true}
                          options={phaseOptions}
                          value={phaseOptions?.filter(
                            (option: { label: string; value: string }) =>
                              field.value?.some(
                                (val) =>
                                  // Ensure we're comparing the same types by converting both to strings for comparison
                                  String(val) === String(option.value)
                              )
                          )}
                          onChange={(selectedOptions) =>
                            field.onChange(
                              selectedOptions?.map((option) => option.value) ||
                                []
                            )
                          }
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </AlertDialogBody>
        )}

        <AlertDialogFooter className="flex justify-end space-x-2">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            className="flex-1"
            form="form"
            type="submit"
            disabled={
              addAnnouncementMutation.isPending ||
              editAnnouncementMutation.isPending
            }
          >
            {addAnnouncementMutation.isPending ||
            editAnnouncementMutation.isPending
              ? "Submitting..."
              : "Submit"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AnnouncementForm;
