import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { Dispatch } from "react";
import {
  AlertDialog,
  AlertDialogActionNoClose,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSearchParams } from "react-router";
import { Skeleton } from "../ui/skeleton";
import { useSidebar } from "../ui/sidebar";

const SubdivisionColumn = ({
  title,
  FormComponent,
  childExist,
  data,
  setParams,
  deleteDialogOpen,
  setDeleteDialogOpen,
  handleDeleteData,
  loading,
  deleteMessage,
  queryParamsKey,
}: {
  title: string;
  FormComponent: ({
    id,
    name,
    children,
  }: {
    id?: string;
    name?: string;
    children: React.ReactNode;
  }) => React.ReactElement;
  data:
    | {
        id: string;
        name: string;
      }[]
    | undefined;
  childExist: boolean;
  setParams: (id: string) => void;
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: Dispatch<React.SetStateAction<boolean>>;
  handleDeleteData: (id: string) => void;
  loading: boolean;
  deleteMessage: string;
  queryParamsKey: string;
}) => {
  const { isMobile } = useSidebar();
  const [params] = useSearchParams();

  return (
    <div
      className={cn("flex-1 overflow-y-scroll no-scrollbar", {
        "border-r border-[#45495A/0.12] rounded-l-xl": childExist && !isMobile,
      })}
    >
      <div className="flex justify-between py-[18px] pl-[32px] pr-[24px] border-b border-[#45495A/0.12]">
        <h1 className="font-semibold">{title}</h1>
        <FormComponent>
          <button className="bg-primary-blue p-1 px-2 rounded-full text-xs text-white flex items-center gap-1">
            <Icon icon={"mingcute:add-fill"} className="h-3 w-3" />
            Add
          </button>
        </FormComponent>
      </div>
      <div className="py-3 px-6">
        {loading ? (
          <div>
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full rounded-lg mb-2" />
            ))}
          </div>
        ) : (
          data &&
          data.map((item) => {
            const isSelected = params.get(queryParamsKey) === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setParams(item.id)}
                className={cn(
                  ` flex items-center  justify-between h-16 rounded-xl mb-2 bg-[#45495A05] ${
                    title !== "Lots" &&
                    "hover:bg-primary-blue hover:text-white hover:cursor-pointer group"
                  } py-3 pl-[24px] pr-[18px]`,
                  {
                    "bg-primary-blue text-white":
                      isSelected && title !== "Lots",
                  }
                )}
              >
                <div>
                  <p>{item.name}</p>
                  <p
                    className={cn(
                      "text-2xs group-hover:text-white",
                      isSelected && title !== "Lots"
                        ? "text-white"
                        : "text-[#45495ABF]"
                    )}
                  >
                    5 Streets
                  </p>
                </div>
                <Popover modal={true}>
                  <PopoverTrigger
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Icon icon={"mingcute:more-2-fill"} className="h-5 w-5" />
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-fit p-0 overflow-hidden outline-none border-none"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex flex-col bg-white">
                      <FormComponent
                        key={item.id}
                        name={item.name}
                        id={item.id}
                      >
                        <Button variant="ghost" className="rounded-none">
                          Edit
                        </Button>
                      </FormComponent>

                      <AlertDialog
                        open={deleteDialogOpen}
                        onOpenChange={(open) => {
                          setDeleteDialogOpen(open);
                        }}
                      >
                        <AlertDialogTrigger asChild>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            variant="ghost"
                            className="rounded-none"
                          >
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              {deleteMessage}
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <AlertDialogFooter>
                            <AlertDialogCancel variant={"default"}>
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogActionNoClose
                              variant={"destructive"}
                              onClick={() => handleDeleteData(item.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Delete
                            </AlertDialogActionNoClose>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            );
          })
        )}
        {data?.length === 0 && (
          <div className="flex items-center justify-center h-16 text-[#45495ABF]">
            No {title} available
          </div>
        )}
      </div>
    </div>
  );
};

export default SubdivisionColumn;
