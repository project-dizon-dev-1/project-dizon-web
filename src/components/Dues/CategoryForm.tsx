import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useDuesCategory from "@/hooks/useDuesCategory";
import { categorySchema, CategoryType } from "@/validations/duesSchema";
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
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const CategoryForm = ({
  categoryId,
  categoryName,
  children,
}: {
  categoryId?: string;
  categoryName?: string;
  children: React.ReactNode;
}) => {
  const form = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      categoryName: categoryName ?? "",
    },
  });
  const { addCategoryMutation, updateCategoryMutation } = useDuesCategory();

  const onSubmit = (data: CategoryType) => {
    if (categoryId) {
      updateCategoryMutation.mutate({ categoryId, data });
      return;
    }

    addCategoryMutation.mutate(data);
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {categoryId ? "Edit Category" : "Add New Category"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {categoryId
              ? "Edit expense category to organize your expenses."
              : "Add a new expense category to organize your expenses"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogBody>
          <Form {...form}>
            <form
              id="category-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-2"
            >
              <FormField
                control={form.control}
                name="categoryName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Input Category Name" {...field} />
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
          <AlertDialogAction form="category-form" type="submit">
            Submit
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CategoryForm;
