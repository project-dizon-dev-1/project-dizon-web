import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogActionNoClose,
  AlertDialogBody,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react/dist/iconify.js";
import { updateUserProfile } from "@/services/userServices";
import { ProfileFormValues, profileSchema } from "@/validations/userSchema";

type HouseData = {
  user_id?: string;
  first_name?: string;
  last_name?: string;
  contact_number?: string | null;
};

interface EditProfileFormProps {
  houseData?: HouseData;
  houseId?: string | null;
}

const EditProfileForm = ({ houseData, houseId }: EditProfileFormProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: houseData?.first_name ?? "",
      lastName: houseData?.last_name ?? "",
      contactNumber: houseData?.contact_number ?? "",
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: ProfileFormValues) => {
      return updateUserProfile({
        userId: houseData?.user_id,
        houseId,
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          contactNumber: data.contactNumber || null,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile", houseData?.user_id],
      });

      toast({
        title: "Profile Updated",
        description: "Your personal information has been successfully updated.",
      });

      setOpen(false);
    },
    onError: (error) => {
      console.error("Failed to update profile:", error);
      toast({
        title: "Update Failed",
        description:
          "There was a problem updating your profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    updateProfileMutation.mutate(data);
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="flex items-center"
      >
        <Icon icon="mingcute:edit-line" className="mr-2 h-4 w-4" />
        Edit Profile
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Profile</AlertDialogTitle>
            <AlertDialogDescription>
              Update your personal information.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <AlertDialogBody>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="First Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Last Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="contactNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your contact number"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </AlertDialogBody>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogActionNoClose
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending ? (
                    <div className="flex items-center">
                      <Icon
                        icon="mingcute:loading-fill"
                        className="mr-2 h-4 w-4 animate-spin"
                      />
                      Updating...
                    </div>
                  ) : (
                    "Save Changes"
                  )}
                </AlertDialogActionNoClose>
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EditProfileForm;
