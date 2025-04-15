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
  AlertDialogActionNoClose,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useUserContext from "@/hooks/useUserContext";

const CategoryForm = ({
  categoryId,
  categoryName,
  children,
}: {
  categoryId?: string;
  categoryName?: string;
  children: React.ReactNode;
}) => {
  const { user } = useUserContext();
  const form = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      categoryName: categoryName ?? "",
    },
  });
  const { addCategoryMutation, updateCategoryMutation } = useDuesCategory();

  const onSubmit = (data: CategoryType) => {
    if (categoryId) {
      updateCategoryMutation.mutate({
        categoryId,
        data: {
          ...data,
          userId: user?.id,
          userName: `${user?.user_first_name} ${user?.user_last_name}`,
        },
      });
      return;
    }

    addCategoryMutation.mutate({
      ...data,
      categoryType: "EXPENSE",
      userId: user?.id,
      userName: `${user?.user_first_name} ${user?.user_last_name}`,
    });
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
          <AlertDialogActionNoClose form="category-form" type="submit">
            Submit
          </AlertDialogActionNoClose>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CategoryForm;
