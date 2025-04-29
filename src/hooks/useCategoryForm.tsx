import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema, CategoryType } from "@/validations/duesSchema";
import useDuesCategory from "@/hooks/useDuesCategory";
import useUserContext from "@/hooks/useUserContext";

const useCategoryForm = (categoryName?: string, categoryId?: string) => {
  const { user } = useUserContext();
  const { addCategoryMutation, updateCategoryMutation } = useDuesCategory();

  const form = useForm<CategoryType>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      categoryName: categoryName || "",
    },
  });

  const onSubmit = (
    data: CategoryType,
    setIsDialogOpen: (open: boolean) => void
  ) => {
    if (categoryId) {
      updateCategoryMutation.mutate({
        categoryId,
        data: {
          ...data,
          userId: user?.id,
          userName: `${user?.user_first_name} ${user?.user_last_name}`,
        },
      });
    } else {
      addCategoryMutation.mutate({
        ...data,
        categoryType: "EXPENSE",
        userId: user?.id,
        userName: `${user?.user_first_name} ${user?.user_last_name}`,
      });
    }

    setIsDialogOpen(false);
  };

  return { form, onSubmit };
};

export default useCategoryForm;
