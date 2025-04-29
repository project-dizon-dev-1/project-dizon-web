import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addStreet, editStreet } from "@/services/subdivisionServices";

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
  AlertDialogTrigger,
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

import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  StreetFormValues,
  streetSchema,
} from "@/validations/subdivisionSchema";
import { useSearchParams } from "react-router";

const StreetForm = ({
  id,
  name,
  children,
}: {
  id?: string;
  name?: string;
  children: ReactNode;
}) => {
  const [params] = useSearchParams();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const edittingStreet = id ? true : false;

  const streetForm = useForm<StreetFormValues>({
    resolver: zodResolver(streetSchema),
    defaultValues: {
      name: name || "",
    },
  });

  const addStreetMutation = useMutation({
    mutationFn: addStreet,
    onSuccess: () => {
      toast({
        title: "Street created",
        description: "Street has been created successfully",
      });
      queryClient.invalidateQueries({
        queryKey: ["streets", params.get("phaseId")],
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create street",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const editStreetMutation = useMutation({
    mutationFn: editStreet,
    onSuccess: () => {
      toast({
        title: "Street updated",
        description: "Street has been updated successfully",
      });
      queryClient.invalidateQueries({
        queryKey: ["streets"],
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: StreetFormValues) => {
    if (edittingStreet) {
      editStreetMutation.mutate({ data, streetId: id });
    } else {
      const payload = {
        ...data,
        phaseId: params.get("phaseId")!,
      };
      addStreetMutation.mutate(payload);
    }
    setDialogOpen(false);
    streetForm.reset();
  };

  return (
    <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {edittingStreet ? "Edit Street" : "Add New Street"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {edittingStreet
              ? "Update the details of this street"
              : "Add a new street to your subdivision"}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...streetForm}>
          <form
            onSubmit={streetForm.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <AlertDialogBody>
              <FormField
                control={streetForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Avocado Street" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter a unique name for this street
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AlertDialogBody>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogActionNoClose type="submit">
                Add Street
              </AlertDialogActionNoClose>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default StreetForm;
