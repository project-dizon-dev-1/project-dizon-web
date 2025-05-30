import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addBlock, editBlock } from "@/services/subdivisionServices";

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
import { BlockFormValues, blockSchema } from "@/validations/subdivisionSchema";
import { useSearchParams } from "react-router";

const BlockForm = ({
  name,
  id,
  children,
}: {
  id?: string;
  name?: string;
  children: ReactNode;
}) => {
  const [params] = useSearchParams();
  const [dialogOpen, setDialogOpen] = useState(false);
  const edittingBlock = id ? true : false;
  const queryClient = useQueryClient();

  const blockForm = useForm<BlockFormValues>({
    resolver: zodResolver(blockSchema),
    defaultValues: {
      name: name || "",
    },
    values: {
      name: name || "",
    },
  });

  const addBlockMutation = useMutation({
    mutationFn: addBlock,
    onSuccess: () => {
      toast({
        title: "Block created",
        description: "Block has been successfully created",
      });
      queryClient.invalidateQueries({
        queryKey: ["blocks", params.get("phaseId")],
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create block",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const editBlockMutation = useMutation({
    mutationFn: editBlock,
    onSuccess: () => {
      toast({
        title: "Block updated",
        description: "Block has been successfully updated",
      });
      queryClient.invalidateQueries({
        queryKey: ["blocks"],
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

  const onSubmit = async (data: BlockFormValues) => {
    if (edittingBlock) {
      editBlockMutation.mutate({
        data: { ...data, phaseId: params.get("phaseId")! },
        blockId: id!,
      });
    } else {
      const payload = {
        ...data,
        phaseId: params.get("phaseId")!,
      };
      addBlockMutation.mutate(payload);
    }
    blockForm.reset();
    setDialogOpen(false);
  };

  const handleOpenDialog = () => {
    blockForm.reset({ name: name || "" });
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
            {edittingBlock ? "Edit Block" : "Add New Block"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {edittingBlock
              ? "Update the details of this block"
              : "Add a new block to your subdivision"}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...blockForm}>
          <form
            onSubmit={blockForm.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <AlertDialogBody>
              <FormField
                control={blockForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Block Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Block 1" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter a unique name for this block
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AlertDialogBody>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogActionNoClose type="submit">
                {edittingBlock ? "Update" : "Create"}
              </AlertDialogActionNoClose>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BlockForm;
