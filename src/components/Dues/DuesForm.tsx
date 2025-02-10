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
  import { Textarea } from "@/components/ui/textarea";
  import { zodResolver } from "@hookform/resolvers/zod";
  import { useForm } from "react-hook-form";
  import { Button } from "../ui/button";
  import { dueSchema, dueType } from "@/validations/duesSchema";
  import { useMutation, useQueryClient } from "@tanstack/react-query";
  import { addDues, updateDues } from "@/services/DuesServices";
  import { toast } from "@/hooks/use-toast";
  import { DialogClose } from "../ui/dialog";
  import { EditDue } from "@/types/DueTypes";
  
  const DuesForm = ({ data }: { data: EditDue }) => {
    const queryClient = useQueryClient();
    const form = useForm({
      resolver: zodResolver(dueSchema),
      defaultValues: {
        dueName: data?.due_name ?? "",
        dueDescription: data?.due_description ?? "",
        dueCost: data?.due_cost ?? 0,
        dueIsActive: data?.due_is_active ?? true,
      },
    });
  
    const duesAddMutation = useMutation({
      mutationFn: addDues,
      onSuccess: () => {
        toast({
          title: "Due Added Successfully",
        });
      },
      onMutate: () => {
        toast({
          title: "Adding Dues...",
        });
      },
      onError: () => {
        toast({
          title: "Error Adding Dues",
        });
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: ["dues"],
        });
      },
    });
  
    const duesEditMutation = useMutation({
      mutationFn: ({ dueId, payload }: { dueId: string | undefined; payload: dueType }) =>
        updateDues(dueId, payload),
      onSuccess: () => {
        toast({
          title: "Due Edited Successfully",
        });
      },
      onMutate: () => {
        toast({
          title: "Editing Dues...",
        });
      },
      onError: () => {
        toast({
          title: "Error Editing Dues",
        });
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: ["dues"],
        });
        queryClient.invalidateQueries({
            queryKey: ["totalDue"],
          });
      },
    });
  
    const onSubmit = (formData: dueType) => {
      if (data?.id) {
        duesEditMutation.mutate({ dueId: data.id, payload: formData });
      } else {
        duesAddMutation.mutate(formData);
      }
    };
  
    return (
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="dueName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Due Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Description" {...field} />
                  </FormControl>
                  <FormDescription>
                    Provide details about the due payment, such as purpose,
                    amount, or additional notes.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueCost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <DialogClose>
                <Button type="submit">Submit</Button>
              </DialogClose>
            </div>
          </form>
        </Form>
      </div>
    );
  };
  
  export default DuesForm;
  