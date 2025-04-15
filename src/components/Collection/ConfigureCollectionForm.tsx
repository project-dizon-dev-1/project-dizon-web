import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogBody,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  configureCollectionSchema,
  configureCollectionSchemaType,
} from "@/validations/collectionSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upsertFixedDue } from "@/services/subdivisionServices";
import { fixedDueType } from "@/types/subdivisionTypes";

const ConfigureCollectionForm = ({
  amount,
  due_date,
  grace_period,
}: fixedDueType) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  // Fixed array of days 1-28 (works for all months)
  const daysInMonth = Array.from({ length: 28 }, (_, i) => i + 1);

  const configureCollectionMutation = useMutation({
    mutationFn: upsertFixedDue,
    onError: (error) => {
      toast({
        title: "Error updating collection",
        description: error.message,
      });
    },
    onMutate: () => {
      toast({
        title: "Updating collection...",
      });
    },
    onSuccess: () => {
      toast({
        title: "Collection updated successfully",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["houseSummary"],
      });
    },
  });

  const form = useForm<configureCollectionSchemaType>({
    resolver: zodResolver(configureCollectionSchema),
    defaultValues: {
      dayOfMonth: due_date ?? 0,
      amount: amount ?? 0,
      gracePeriod: grace_period ?? 0,
    },
  });

  const onSubmit = async (data: configureCollectionSchemaType) => {
    configureCollectionMutation.mutate(data);
    form.reset();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button className="fixed right-12 bottom-12 z-10">
          Configure Collection
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Configure Fixed Due</AlertDialogTitle>
          <AlertDialogDescription>
            Set up the monthly dues and payment terms.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <AlertDialogBody>
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Amount (₱)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter amount"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Set the monthly due amount for residents
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dayOfMonth"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Day</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full ">
                          <SelectValue placeholder="Select day of month" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="h-[200px]">
                        {daysInMonth.map((day) => (
                          <SelectItem key={day} value={day.toString()}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the day of the month when payment is due (1-28)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gracePeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grace Period (days)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter grace period"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Number of days after due date before late penalties apply
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AlertDialogBody>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  form.handleSubmit(onSubmit)();
                }}
              >
                {"Save Changes"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfigureCollectionForm;
