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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@iconify/react/dist/iconify.js";
import CategoryForm from "@/components/Dues/CategoryForm";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import DuesForm from "@/components/Dues/DuesForm";

const Dues = () => {
  const { deleteDuesMutation, toggleActivateMutation } = useDues();
  const { categories, deleteCategoryMutation } = useDuesCategory();

  if (categories.isError) {
    return <p>error fetching dues</p>;
  }

  if (categories.isLoading) {
    return <Loading />;
  }
  return (
    <div className="relative h-full w-full">
      <Accordion type="single" collapsible>
        {categories?.data?.map((category, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <div className="flex justify-between items-center bg-white rounded-xl mb-1 mt-1 px-4">
              <AccordionTrigger>
                <span className="font-bold">{category.name}</span>
                <span className="bg-[#DEEDFF] font-medium text-[#5B8DCF] p-1 rounded-md">
                  {category.total_expenses.toLocaleString()}
                </span>
              </AccordionTrigger>

              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Icon
                    className="w-5 h-5 cursor-pointer"
                    icon="mingcute:more-1-line"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {/* Prevent dropdown from closing by adding onSelect with preventDefault */}
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <CategoryForm
                      categoryId={category.id}
                      categoryName={category.name}
                    >
                      <div className="w-full">Edit Category</div>
                    </CategoryForm>
                  </DropdownMenuItem>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        Delete Category
                      </DropdownMenuItem>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Category</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this category? Action
                          will delete all expenses associated with this
                          category.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <Separator />
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            deleteCategoryMutation.mutate(category.id)
                          }
                          variant="destructive"
                          type="submit"
                        >
                          Submit
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <AccordionContent className="flex items-center justify-between px-4 pt-2 pb-1">
              <h4 className="text-sm font-medium text-muted-foreground">
                Expenses
              </h4>
              <DuesForm categoryId={category.id}>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Icon icon={"mingcute:add-line"} className="h-3.5 w-3.5" />
                  Add Expense
                </Button>
              </DuesForm>
            </AccordionContent>
            {category?.dues_list?.map((due, index) => (
              <AccordionContent
                className={cn(
                  "flex justify-between p-3 rounded-xl m-1 bg-white/75 "
                )}
                key={index}
              >
                <div>
                  <span className="font-semibold">{due.due_name}</span>{" "}
                  <span className="bg-[#DEEDFF] font-medium text-[#5B8DCF] p-1 rounded-md">
                    {due.due_cost.toLocaleString()}
                  </span>
                </div>
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Icon
                      className="w-5 h-5 cursor-pointer"
                      icon="mingcute:more-1-line"
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {/* Prevent dropdown from closing by adding onSelect with preventDefault */}
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <DuesForm
                        data={{
                          dueId: due.id,
                          dueName: due.due_name,
                          dueCost: due.due_cost,
                          dueDescription: due.due_description,
                        }}
                        categoryId={category.id}
                      >
                        <div className="w-full">Edit Expense</div>
                      </DuesForm>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        toggleActivateMutation.mutate({
                          dueId: due.id,
                          dueIsActive: !due.due_is_active,
                        })
                      }
                    >
                      {due.due_is_active
                        ? "Deactivate Expense"
                        : "Activate Expense"}
                    </DropdownMenuItem>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          Delete Expense
                        </DropdownMenuItem>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Expense</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this expense?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <Separator />
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteDuesMutation.mutate(due.id)}
                            variant="destructive"
                            type="submit"
                          >
                            Submit
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </AccordionContent>
            ))}
          </AccordionItem>
        ))}
      </Accordion>
      <CategoryForm>
        <Button className="absolute p-5 rounded-3xl -right-2 -bottom-2">
          Create Category
        </Button>
      </CategoryForm>
    </div>
  );
};

export default Dues;
