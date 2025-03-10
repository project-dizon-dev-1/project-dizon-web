import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  const queryClient = useQueryClient();
  const { user } = useUserContext();

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
      phases: formPhases ?? [],
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
        description: "Error editting announcement",
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
    label: `Phase ${phase}`,
    value: phase,
  }));

  useEffect(() => {
    if (formPhases) {
      form.setValue("phases", formPhases);
    }
  }, [formPhases, form]);

  // useEffect(() => {
  //   const files = form.getValues("files") || [];
  //   const urls = files.map((file: File) => URL.createObjectURL(file));
  //   setFilePreviews(urls);

  //   return () => urls.forEach((url) => URL.revokeObjectURL(url)); // Cleanup URLs
  // }, [form.watch("files")]);

  useEffect(() => {
    const urlToFile = async (url: string, filename: string): Promise<File> => {
      const response = await fetch(url);
      const blob = await response.blob();
      return new File([blob], filename, { type: blob.type });
    };

    const fetchFiles = async () => {
      if (announcement) {
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
  }, []);

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
    // formData.append("visibility", values.visibility);
    formData.append("content", values.content);

    // Ensure phases is always an array
    formData.append("phases", JSON.stringify(values.phases || []));

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
    <Dialog
      open={dialogOpen}
      onOpenChange={(open) => {
        setDialogOpen(open);
        if (!open) {
          setCurrentFiles([]);
          form.reset();
        }
      }}
    >
      <DialogTrigger className="w-full">{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Announcement</DialogTitle>
          <DialogDescription>
            create an announcement to your phases.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Announcement Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Content" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* File Upload Section */}
            <FormField
              control={form.control}
              name="files"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload Files</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      multiple
                      onChange={(e) => {
                        const files = e.target.files;

                        if (files && files.length > 0) {
                          field.onChange([
                            ...currentFiles,
                            ...Array.from(files), // Convert FileList to array
                          ]);
                          setCurrentFiles((prevState) => [
                            ...prevState,
                            ...Array.from(files), // Convert FileList to array
                          ]);

                          const fileArray = Array.from(files); // Convert FileList to array
                          setFilePreviews((prevState) => [
                            ...prevState,
                            ...fileArray.map((item) =>
                              URL.createObjectURL(item)
                            ),
                          ]);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 overflow-x-scroll">
              {filePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <p
                    onClick={() => handleRemoveFile(index)}
                    className="absolute top-0 right-0  text-red-400 px-2 rounded-full cursor-pointer"
                  >
                    x
                  </p>
                  <img
                    src={preview}
                    alt={`Preview ${index}`}
                    className="w-20 h-20 object-cover rounded"
                  />
                </div>
              ))}
            </div>

            {/* <FormField
          control={form.control}
          name="visibility"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Visibility</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent className="">
                    <SelectGroup>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

            <FormField
              control={form.control}
              name="phases"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phases</FormLabel>
                  <FormControl>
                    <CustomReactSelect
                      options={phaseOptions}
                      isLoading={isLoading}
                      value={phaseOptions?.filter((option) =>
                        field.value?.includes(option.value)
                      )}
                      onChange={(selectedOptions) =>
                        field.onChange(
                          selectedOptions?.map((option) => option.value) || []
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

            <div className="flex justify-end">
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AnnouncementForm;
