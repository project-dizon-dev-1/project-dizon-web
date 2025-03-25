import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Loading from "@/components/Loading";
import useDues from "@/hooks/useDues";
import useDuesCategory from "@/hooks/useDuesCategory";
import {
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

import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react/dist/iconify.js";
import CategoryForm from "@/components/Dues/CategoryForm";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import DuesForm from "@/components/Dues/DuesForm";
import useUserContext from "@/hooks/useUserContext";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Dues = () => {
  const { user } = useUserContext();
  const { deleteDuesMutation, toggleActivateMutation } = useDues();
  const { categories, deleteCategoryMutation } = useDuesCategory();

  if (categories.isError) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Card className="p-8 text-center">
          <Icon
            icon="mingcute:alert-line"
            className="mx-auto mb-4 h-12 w-12 text-red-500"
          />
          <h2 className="text-xl font-semibold">Error Loading Dues</h2>
          <p className="mt-2 text-gray-600">
            Unable to fetch dues information. Please try again later.
          </p>
        </Card>
      </div>
    );
  }

  if (categories.isLoading) {
    return <Loading />;
  }

  return (
    <div className="relative h-full w-full overflow-auto p-2">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Dues Categories</h2>
        <CategoryForm>
          <Button className="flex items-center gap-2">
            <Icon icon="mingcute:add-line" className="h-5 w-5" />
            Create Category
          </Button>
        </CategoryForm>
      </div>

      {categories?.data?.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-12">
          <Icon
            icon="mingcute:document-line"
            className="mb-4 h-16 w-16 text-gray-400"
          />
          <h3 className="text-xl font-medium">No Categories Yet</h3>
          <p className="mb-4 mt-2 text-center text-gray-500">
            Create your first expense category to start organizing your dues
          </p>
          <CategoryForm>
            <Button>Create Category</Button>
          </CategoryForm>
        </div>
      ) : (
        <Accordion type="single" collapsible className="space-y-4">
          {categories?.data?.map((category, index) => (
            <Card key={index} className="overflow-hidden">
              <AccordionItem value={`item-${index}`} className="border-none">
                <div className="flex items-center justify-between px-6 py-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold">{category.name}</span>
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700"
                      >
                        ₱{category.total_expenses.toLocaleString()}
                      </Badge>
                    </div>
                  </AccordionTrigger>

                  <div className="flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div onClick={(e) => e.stopPropagation()}>
                            <CategoryForm
                              categoryId={category.id}
                              categoryName={category.name}
                            >
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Icon
                                  icon="mingcute:edit-line"
                                  className="h-4 w-4"
                                />
                              </Button>
                            </CategoryForm>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          Edit Category
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <AlertDialog>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                              >
                                <Icon
                                  icon="mingcute:delete-line"
                                  className="h-4 w-4"
                                />
                              </Button>
                            </AlertDialogTrigger>
                          </TooltipTrigger>
                          <TooltipContent>Delete Category</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Delete {category.name}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this category? This
                            action will remove all expenses associated with this
                            category.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <Separator />
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              deleteCategoryMutation.mutate({
                                categoryId: category.id,
                                data: {
                                  userId: user?.id,
                                  userName: `${user?.user_first_name} ${user?.user_last_name}`,
                                },
                              })
                            }
                            variant="destructive"
                          >
                            Delete Category
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <AccordionContent className="pb-0 pt-0">
                  <Separator className="mb-2" />
                  <div className="flex items-center justify-between px-6 py-2">
                    <h4 className="text-sm font-semibold text-gray-600">
                      {category.dues_list?.length || 0} Expenses
                    </h4>
                    <DuesForm categoryId={category.id}>
                      <Button variant="outline" size="sm" className="h-8 gap-1">
                        <Icon
                          icon="mingcute:add-line"
                          className="h-3.5 w-3.5"
                        />
                        Add Expense
                      </Button>
                    </DuesForm>
                  </div>

                  <div className="space-y-2 px-4 pb-4">
                    {category.dues_list?.length === 0 ? (
                      <div className="flex items-center justify-center rounded-md bg-gray-50 p-4">
                        <p className="text-sm text-gray-500">
                          No expenses in this category yet
                        </p>
                      </div>
                    ) : (
                      category.dues_list?.map((due, index) => (
                        <div
                          key={index}
                          className={cn(
                            "flex items-center justify-between rounded-lg p-3 transition-all",
                            due.due_is_active
                              ? "bg-white shadow-sm hover:bg-gray-50"
                              : "bg-gray-100 opacity-70"
                          )}
                        >
                          <div className="flex flex-1 items-center gap-3">
                            {!due.due_is_active && (
                              <Badge
                                variant="outline"
                                className="bg-gray-100 text-gray-500"
                              >
                                Inactive
                              </Badge>
                            )}
                            <span className="font-medium">{due.due_name}</span>
                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                              ₱{due.due_cost.toLocaleString()}
                            </Badge>
                            {due.due_description && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Icon
                                      icon="mingcute:information-line"
                                      className="h-4 w-4 cursor-help text-gray-400"
                                    />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {due.due_description}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div onClick={(e) => e.stopPropagation()}>
                                    <DuesForm
                                      data={{
                                        dueId: due.id,
                                        dueName: due.due_name,
                                        dueCost: due.due_cost,
                                        dueDescription: due.due_description,
                                      }}
                                      categoryId={category.id}
                                    >
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <Icon
                                          icon="mingcute:edit-line"
                                          className="h-3.5 w-3.5"
                                        />
                                      </Button>
                                    </DuesForm>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                  Edit Expense
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className={cn(
                                      "h-7 w-7",
                                      due.due_is_active
                                        ? "text-amber-600 hover:bg-amber-50 hover:text-amber-700"
                                        : "text-green-600 hover:bg-green-50 hover:text-green-700"
                                    )}
                                    onClick={() =>
                                      toggleActivateMutation.mutate({
                                        dueId: due.id,
                                        dueIsActive: !due.due_is_active,
                                      })
                                    }
                                  >
                                    <Icon
                                      icon={
                                        due.due_is_active
                                          ? "mingcute:pause-line"
                                          : "mingcute:play-line"
                                      }
                                      className="h-3.5 w-3.5"
                                    />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {due.due_is_active
                                    ? "Deactivate Expense"
                                    : "Activate Expense"}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <AlertDialog>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 text-red-600 hover:bg-red-50 hover:text-red-700"
                                      >
                                        <Icon
                                          icon="mingcute:delete-line"
                                          className="h-3.5 w-3.5"
                                        />
                                      </Button>
                                    </AlertDialogTrigger>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    Delete Expense
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Delete {due.due_name}
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this
                                    expense?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <Separator />
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      deleteDuesMutation.mutate({
                                        dueId: due.id,
                                        payload: {
                                          userId: user?.id,
                                          userName: `${user?.user_first_name} ${user?.user_last_name}`,
                                        },
                                      })
                                    }
                                    variant="destructive"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Card>
          ))}
        </Accordion>
      )}
    </div>
  );
};

export default Dues;
