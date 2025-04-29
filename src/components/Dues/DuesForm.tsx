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
import { Button } from "../ui/button";
import useDues from "@/hooks/useDues";
import { EditDue } from "@/types/DueTypes";
import {
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
  AlertDialog,
  AlertDialogContent,
  AlertDialogCancel,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogActionNoClose,
} from "@/components/ui/alert-dialog";
import React, { useState } from "react";

const DuesForm = ({
  data,
  children,
  categoryId,
}: {
  categoryId?: string;
  data?: EditDue;
  children: React.ReactNode;
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { onSubmit, form } = useDues(data);

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {data ? "Edit Expense" : "Add New Expense"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {data
              ? "Update the expense details below"
              : " Add a new expense below"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogBody>
          <Form {...form}>
            <form
              id="due-form"
              onSubmit={form.handleSubmit((data) => {
                onSubmit(data, categoryId), setIsDialogOpen(false);
              })} // Add categoryId to the onSubmit function
              className="space-y-2"
            >
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
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
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
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="secondary">Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogActionNoClose form="due-form" type="submit">
            Submit
          </AlertDialogActionNoClose>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DuesForm;
