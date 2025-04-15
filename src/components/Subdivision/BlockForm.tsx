import { ReactNode, useEffect, useState } from "react";
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
  // const [searchTerm, setSearchTerm] = useState("");

  const blockForm = useForm<BlockFormValues>({
    resolver: zodResolver(blockSchema),
    defaultValues: {
      name: name ?? "",
    },
  });

  useEffect(() => {
    if (edittingBlock && name) {
      blockForm.setValue("name", name);
    }
  }, [edittingBlock, name, blockForm]);

  const addBlockMutation = useMutation({
    mutationFn: addBlock,
    onSuccess: () => {
      toast({
        title: "Block created",
        description: "Block has been successfully created",
      });
      queryClient.invalidateQueries({
        queryKey: ["blocks", params.get("streetId")],
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
      });
    },
  });

  const onSubmit = async (data: BlockFormValues) => {
    if (edittingBlock) {
      editBlockMutation.mutate({ data, blockId: id! });
    } else {
      const payload = {
        ...data,
        streetId: params.get("streetId")!,
      };
      addBlockMutation.mutate(payload);
    }
    blockForm.reset();
    setDialogOpen(false);
  };

  // const handleEdit = (block: Block) => {
  //   const blockFormValues: BlockFormValues = {
  //     id: block.id,
  //     name: block.name,
  //     phaseId: block.phase_id,
  //   };
  //   setEditingBlock(blockFormValues);
  //   blockForm.reset(blockFormValues);
  //   setDialogOpen(true);
  // };

  // const filteredBlocks = blocks.filter((block) =>
  //   block.name.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  return (
    <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
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
                Add Block
              </AlertDialogActionNoClose>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BlockForm;
