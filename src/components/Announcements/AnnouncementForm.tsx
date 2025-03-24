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
  FormDescription,
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
import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchSubdivisionPhases } from "@/services/subdivisionServices";
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

const AnnouncementForm = ({
  announcement,
  children,
}: {
  announcement?: Announcement["announcements"];
  children: React.ReactNode;
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentFiles, setCurrentFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [selectedPDF, setSelectedPDF] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedFileType, setSelectedFileType] = useState(
    announcement?.announcement_files ? "Image(s)" : "None"
  );
  const queryClient = useQueryClient();
  const { user } = useUserContext();

  const fileTypes = [
    { icon: "minus-circle-fill", value: "None" },
    { icon: "photo-album-fill", value: "Image(s)" },
    { icon: "video-fill", value: "Video" },
    { icon: "file-fill", value: "PDF Document" },
  ];

  const { data: formPhases } = useQuery({
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

  const {
    data: phases,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["phases"],
    queryFn: fetchSubdivisionPhases,
  });

  const addAnnouncementMutation = useMutation({
    mutationFn: addAnnouncement,
    onError: () => {
      toast({
        title: "Error",
        description: "Error adding announcement",
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Announcement added",
      });
      setDialogOpen(false);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["announcements"],
      });
    },
  });

  const editAnnouncementMutation = useMutation({
    mutationFn: editAnnouncement,
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

  const phaseOptions = phases?.map((phase) => ({
    label: `Phase ${phase.phase_number}`,
    value: phase.phase_number.toString(),
  }));

  // Set phases once formPhases are loaded
  useEffect(() => {
    if (formPhases && formPhases.length > 0) {
      form.setValue("phases", formPhases);
    }
  }, [formPhases, form]);

  // Load files for editing
  useEffect(() => {
    const urlToFile = async (url: string, filename: string): Promise<File> => {
      const response = await fetch(url);
      const blob = await response.blob();
      return new File([blob], filename, { type: blob.type });
    };

    const fetchFiles = async () => {
      if (announcement?.announcement_files?.length) {
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

    fetchFiles();
  }, [announcement, form]);

  const handleRemoveFile = (index: number) => {
    const updatedFiles =
      form.getValues("files")?.filter((_, i) => i !== index) || [];

    // Update files in the form state
    form.setValue("files", updatedFiles);
    setCurrentFiles(updatedFiles);

    // Update filePreviews state
    setFilePreviews((prev) => prev.filter((_, i) => i !== index));
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

  return (
    <AlertDialog
      open={dialogOpen}
      onOpenChange={(open) => {
        setDialogOpen(open);
        if (!open) {
          setCurrentFiles([]);
          form.reset();
        }
      }}
    >
      <AlertDialogTrigger className="w-full">{children}</AlertDialogTrigger>
      <AlertDialogContent className="max-h-[80%] w-full overflow-y-scroll no-scrollbar">
        <AlertDialogHeader>
          <AlertDialogTitle>Create Announcement</AlertDialogTitle>
          <AlertDialogDescription>
            Create an announcement to be displayed to the residents.
          </AlertDialogDescription>
        </AlertDialogHeader>
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
                          accept={
                            selectedFileType === "Image(s)"
                              ? "image/*"
                              : selectedFileType === "Video"
                              ? "video/*"
                              : "application/pdf"
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
                              } else {
                                const file = files[0];
                                const url = URL.createObjectURL(file);

                                if (file.type === "application/pdf") {
                                  setSelectedPDF(url);
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
                                onClick={() => {
                                  setFilePreviews([]);
                                  setSelectedFileType(value);
                                  setCurrentFiles([]);
                                  setSelectedVideo("");
                                  setSelectedPDF("");
                                  form.setValue("files", []);
                                }}
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
                                  <img
                                    className="object-cover object-center"
                                    src={url}
                                    alt="an image"
                                  />
                                  <Icon
                                    onClick={() => handleRemoveFile(index)}
                                    className="absolute right-1 top-1 text-xl hover:cursor-pointer"
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
                              <div className="flex max-h-[110px] w-full max-w-[420px] justify-center gap-3 overflow-x-scroll">
                                <div className="relative flex h-[100px] w-[100px] flex-shrink-0 rounded-md">
                                  <video controls={true} src={selectedVideo} />
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

                          {selectedFileType === "PDF Document" &&
                            (selectedPDF ? (
                              <div className="flex max-h-[110px] w-full max-w-[420px] justify-center gap-3 overflow-x-scroll">
                                <div className="flex items-center flex-col relative h-[100px] w-[100px] flex-shrink-0 rounded-md">
                                  <Icon
                                    className="h-11 w-11 text-[#DEEDFF]"
                                    icon={"mingcute:pdf-fill"}
                                  />
                                  <p className="text-2xs text-[#DEEDFF]">
                                    {form.getValues("files")?.[0]?.name}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <Label htmlFor="file-input">
                                <div className="flex h-[110px] flex-col items-center justify-center hover:cursor-pointer">
                                  <div className="flex flex-shrink-0 items-center justify-center rounded-md">
                                    <Icon
                                      className="h-11 w-11 text-[#DEEDFF]"
                                      icon={"mingcute:pdf-fill"}
                                    />
                                  </div>
                                  <p className="text-[12px] font-semibold text-[#DEEDFF]">
                                    Upload PDF
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
                        isLoading={isLoading}
                        value={phaseOptions?.filter((option) =>
                          field.value?.some(
                            (val) =>
                              // Ensure we're comparing the same types by converting both to strings for comparison
                              String(val) === String(option.value)
                          )
                        )}
                        onChange={(selectedOptions) =>
                          field.onChange(
                            selectedOptions?.map((option) =>
                              // Ensure the value is converted to a number
                              typeof option.value === "string"
                                ? Number(option.value)
                                : option.value
                            ) || []
                          )
                        }
                        placeholder={
                          isError ? "Failed to load phases" : "Select Phase..."
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      {isError && "There was an error fetching phases."}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </AlertDialogBody>
        <AlertDialogFooter className="flex justify-end space-x-2">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button className="flex-1" form="form" type="submit">
            Submit
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AnnouncementForm;
