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
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useDuesCategory from "@/hooks/useDuesCategory";
import {
  transactionSchema,
  TransactionType,
  // PAYMENT_METHOD_VALUES,
} from "@/validations/transactionSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useState, ReactNode, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { addTransaction } from "@/services/transactionServices";
import useUserContext from "@/hooks/useUserContext";

const TransactionDialog = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { categories } = useDuesCategory();
  const queryClient = useQueryClient();
  const { user } = useUserContext();

  const form = useForm<TransactionType>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "EXPENSE",
      amount: 0,
      category: "",
      payment_method_type: "CASH",
      description: "",
      transactionProof: undefined,
    },
  });

  // Watch the type field to update category options
  const transactionType = form.watch("type");

  const addTransactionMutation = useMutation({
    mutationFn: addTransaction,
    onSuccess: () => {
      toast({
        title: "Transaction Added Successfully",
      });
      // Refresh financial data
      queryClient.invalidateQueries({ queryKey: ["financeSummary"] });
      queryClient.invalidateQueries({ queryKey: ["financeChartData"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      setIsOpen(false);
      resetForm();
    },
    onMutate: () => {
      toast({
        title: "Adding Transaction...",
      });
    },
    onError: () => {
      toast({
        title: "Error Adding Transaction",
      });
    },
  });

  // Handle form submission
  const onSubmit = async (data: TransactionType) => {
    if (user) {
      const dataWithId = {
        ...data,
        userId: user.id,
      };
      addTransactionMutation.mutate(dataWithId);
    }
  };

  const resetForm = () => {
    form.reset({
      type: "EXPENSE",
      amount: 0,
      category: "",
      payment_method_type: "CASH",
      description: "",
      transactionProof: undefined,
    });
    setImagePreview(null);
  };
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, []);

  // Handle image removal
  const handleRemoveImage = () => {
    URL.revokeObjectURL(imagePreview as string);
    setImagePreview(null);
    form.unregister("transactionProof");
  };

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) resetForm();
      }}
    >
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Record New Transaction</AlertDialogTitle>
          <AlertDialogDescription>
            Enter the details for the financial transaction
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form
            id="transaction-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <AlertDialogBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Transaction Type */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">
                        Transaction Type <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select transaction type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="INCOME">Income</SelectItem>
                            <SelectItem value="EXPENSE">Expense</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category */}
                {transactionType && (
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">
                          Category <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {transactionType === "EXPENSE" ? (
                                categories?.data?.map(
                                  (category: any, index: number) => (
                                    <SelectItem
                                      key={index}
                                      value={category.name}
                                    >
                                      {category.name}
                                    </SelectItem>
                                  )
                                )
                              ) : (
                                <>
                                  <SelectItem value="Club House Booking">
                                    Club House Booking
                                  </SelectItem>
                                  {/* <SelectItem value="Resident Payment">
                                    Resident Payment
                                  </SelectItem> */}
                                  <SelectItem value="Other">
                                    Other Income
                                  </SelectItem>
                                </>
                              )}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {/* Amount and Payment Method */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">
                        Amount (₱) <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter amount"
                          {...field}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="payment_method_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">
                        Payment Method <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CASH">Cash</SelectItem>
                            {/* {PAYMENT_METHOD_VALUES.map((method) => (
                              <SelectItem key={method} value={method}>
                                {method.charAt(0) +
                                  method.slice(1).toLowerCase()}
                              </SelectItem>
                            ))} */}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">
                      Description <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Additional information about the transaction..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator className="my-2" />

              {/* Transaction Proof */}
              <FormField
                control={form.control}
                name="transactionProof"
                render={({ field: { onChange } }) => (
                  <FormItem>
                    <FormLabel className="font-medium">
                      Transaction Proof <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="file-input"
                        type="file"
                        accept="image/png, image/jpeg"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const previewUrl = URL.createObjectURL(file);
                            setImagePreview(previewUrl);
                            onChange(file);
                          }
                        }}
                      />
                    </FormControl>

                    {imagePreview ? (
                      <div className="relative h-full min-h-[210px] w-full overflow-hidden rounded-lg border border-blue-100">
                        <img
                          className="h-full w-full object-contain"
                          src={imagePreview}
                          alt="Transaction proof"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute right-2 top-2"
                          onClick={handleRemoveImage}
                        >
                          <Icon
                            className="h-4 w-4"
                            icon="mingcute:close-line"
                          />
                        </Button>
                      </div>
                    ) : (
                      <Label htmlFor="file-input">
                        <div className="flex h-[210px] flex-col items-center justify-center rounded-lg border border-dashed border-blue-400 hover:cursor-pointer hover:bg-blue-50">
                          <div className="flex flex-shrink-0 items-center justify-center rounded-md">
                            <Icon
                              className="h-11 w-11 text-blue-300"
                              icon={"mingcute:upload-2-fill"}
                            />
                          </div>
                          <p className="mt-2 text-sm font-medium text-blue-500">
                            Click to upload transaction proof
                          </p>
                          <p className="text-xs text-gray-500">
                            JPG, PNG up to 5MB
                          </p>
                        </div>
                      </Label>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AlertDialogBody>
          </form>
        </Form>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={resetForm}>Cancel</AlertDialogCancel>
          <AlertDialogActionNoClose
            onClick={() => form.handleSubmit(onSubmit)()}
            type="submit"
            disabled={addTransactionMutation.isPending}
          >
            {addTransactionMutation.isPending ? (
              <>
                <Icon
                  icon="mingcute:loading-fill"
                  className="h-4 w-4 animate-spin mr-2"
                />
                Processing...
              </>
            ) : (
              " Record Transaction"
            )}
          </AlertDialogActionNoClose>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TransactionDialog;
