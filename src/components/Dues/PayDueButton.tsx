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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PAYMENT_METHOD_VALUES } from "@/validations/transactionSchema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTransaction } from "@/services/transactionServices";
import { toast } from "@/hooks/use-toast";
import useUserContext from "@/hooks/useUserContext";

const paymentSchema = z.object({
  payment_method_type: z.enum(PAYMENT_METHOD_VALUES),
  transactionProof: z
    .any()
    .refine((file) => file instanceof File || file === undefined, {
      message: "Payment proof is required",
    })
    .refine(
      (file) => {
        if (file instanceof File) return true;
        return false;
      },
      {
        message: "Payment proof is required",
      }
    ),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

type PayDueButtonProps = {
  dueId: string | undefined;
  dueName: string;
  amount: number;
  categoryName: string;
};

const PayDueButton = ({
  dueId,
  dueName,
  amount,
  categoryName,
}: PayDueButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { user } = useUserContext();
  const queryClient = useQueryClient();

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      payment_method_type: "CASH",
    },
  });

  const paymentMutation = useMutation({
    mutationFn: addTransaction,
    onSuccess: () => {
      toast({ title: "Payment recorded successfully" });
      queryClient.invalidateQueries({ queryKey: ["duesCategories"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      setIsOpen(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error recording payment",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    form.reset({
      payment_method_type: "CASH",
    });
    setImagePreview(null);
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  });

  const handleRemoveImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    form.setValue("transactionProof", undefined);
  };

  const onSubmit = (data: PaymentFormData) => {
    if (!user?.id) {
      toast({ title: "User not logged in", variant: "destructive" });
      return;
    }

    const transactionData = {
      dueId,
      userId: user.id,
      type: "EXPENSE" as const,
      amount,
      category: categoryName,
      payment_method_type: data.payment_method_type,
      description: `Monthly expense for ${dueName}`,
      transactionProof: data.transactionProof,
    };

    paymentMutation.mutate(transactionData);
  };

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) resetForm();
      }}
    >
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2 h-7">
          <Icon icon="mingcute:bank-card-line" className="mr-1 h-3.5 w-3.5" />
          Pay
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-h-[80vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Pay for {dueName}</AlertDialogTitle>
          <AlertDialogDescription>
            Record payment of ₱{amount.toLocaleString()} for {dueName}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogBody>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              id="payment-form"
              className="space-y-6 py-4"
            >
              <div className="bg-blue-50 p-3 rounded-md mb-4 text-sm">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Expense:</span>
                  <span>{dueName}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Category:</span>
                  <span>{categoryName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Amount:</span>
                  <span className="font-bold">₱{amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Description:</span>
                  <span>{`Monthly expense for ${dueName}`}</span>
                </div>
              </div>

              {/* Payment Method Field */}
              <FormField
                control={form.control}
                name="payment_method_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem key={"CASH"} value={"CASH" as const}>
                            {"CASH"}
                          </SelectItem>
                          {/* {PAYMENT_METHOD_VALUES.map((method) => (
                            <SelectItem key={method} value={method}>
                              {method.charAt(0) + method.slice(1).toLowerCase()}
                            </SelectItem>
                          ))} */}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Transaction Proof Field - Fixed implementation */}
              <FormField
                control={form.control}
                name="transactionProof"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Proof</FormLabel>
                    <FormControl>
                      <Input
                        id="proof-upload"
                        type="file"
                        accept="image/png, image/jpeg"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = URL.createObjectURL(file);
                            setImagePreview(url);
                            field.onChange(file);
                          }
                        }}
                      />
                    </FormControl>

                    {imagePreview ? (
                      <div className="relative h-full min-h-[210px] w-full overflow-hidden rounded-lg border border-blue-100">
                        <img
                          className="h-full w-full object-contain"
                          src={imagePreview}
                          alt="Payment proof"
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
                      <Label htmlFor="proof-upload">
                        <div className="flex h-[210px] flex-col items-center justify-center rounded-lg border border-dashed border-blue-400 hover:cursor-pointer hover:bg-blue-50">
                          <div className="flex flex-shrink-0 items-center justify-center rounded-md">
                            <Icon
                              className="h-11 w-11 text-blue-300"
                              icon={"mingcute:upload-2-fill"}
                            />
                          </div>
                          <p className="mt-2 text-sm font-medium text-blue-500">
                            Click to upload payment proof
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
            </form>
          </Form>
        </AlertDialogBody>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={resetForm}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={form.handleSubmit(onSubmit)}
            type="button"
            disabled={paymentMutation.isPending || !imagePreview}
          >
            {paymentMutation.isPending
              ? "Processing..."
              : `Pay ₱${amount.toLocaleString()}`}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default PayDueButton;
