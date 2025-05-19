import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addLot, editLot } from "@/services/subdivisionServices";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LotFormValues, lotSchema } from "@/validations/subdivisionSchema";
import { useSearchParams } from "react-router";

const LotForm = ({
  id,
  name,
  children,
}: {
  id?: string;
  name?: string;
  children: ReactNode;
}) => {
  const edittingLot = id ? true : false;
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [params] = useSearchParams();

  const lotForm = useForm<LotFormValues>({
    resolver: zodResolver(lotSchema),
    defaultValues: {
      name: name || "",
    },
    values: {
      name: name || "",
    },
  });

  const addLotMutation = useMutation({
    mutationFn: addLot,
    onSuccess: () => {
      toast({
        title: "Lot created",
        description: "Lot has been created successfully",
      });
      queryClient.invalidateQueries({
        queryKey: ["lots"],
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create lot",
        description: ` ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const updateLotMutation = useMutation({
    mutationFn: editLot,
    onSuccess: () => {
      toast({
        title: "Lot updated",
        description: "Lot has been updated successfully",
      });
      queryClient.invalidateQueries({
        queryKey: ["lots"],
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update lot",
        description: ` ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: LotFormValues) => {
    if (edittingLot) {
      updateLotMutation.mutate({
        data,
        lotId: id,
      });
    } else {
      const payload = {
        ...data,
        blockId: params.get("blockId")!,
      };
      addLotMutation.mutate(payload);
    }
    setDialogOpen(false);
    lotForm.reset();
  };

  const handleOpenDialog = () => {
    lotForm.reset({ name: name || "" });
    setDialogOpen(true);
  };

  return (
    <AlertDialog
      open={dialogOpen}
      onOpenChange={(open) => {
        if (open) handleOpenDialog();
        else setDialogOpen(false);
      }}
    >
      <AlertDialogTrigger
        asChild
        onClick={(e) => {
          e.preventDefault();
          handleOpenDialog();
        }}
      >
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {edittingLot ? "Edit Lot" : "Add New Lot"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {edittingLot
              ? "Update the details of this lot"
              : "Add a new lot to your subdivision"}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...lotForm}>
          <form onSubmit={lotForm.handleSubmit(onSubmit)} className="space-y-4">
            <AlertDialogBody>
              <FormField
                control={lotForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lot Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Lot 1" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter a unique name for this lot
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AlertDialogBody>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogActionNoClose type="submit">
                {edittingLot ? "Update" : "Create"}
              </AlertDialogActionNoClose>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LotForm;
