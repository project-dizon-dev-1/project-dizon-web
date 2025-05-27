import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertDialog,
  AlertDialogActionNoClose,
  AlertDialogBody,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import {
  collectionSchema,
  CollectionType,
} from "@/validations/collectionSchema";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updateHousePayment } from "@/services/houseServices";
import { Textarea } from "../ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Label } from "../ui/label";
import { fetchFixedDue } from "@/services/dueServices";
import { formatAmount } from "@/lib/utils";

const CollectionForm = ({
  houseId,
  familyName,
  houseLatestPayment,
}: {
  familyName: string;
  houseId: string;
  houseLatestPayment: Date | null;
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [amountToPay, setAmountToPay] = useState<number>(0);
  const [monthsPaying, setMonthsPaying] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: fixedDue } = useQuery({
    queryKey: ["fixedDue"],
    queryFn: fetchFixedDue,
  });

  const form = useForm({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      houseLatestPaymentAmount: 0,
      housePaymentMonths: 1,
      housePaymentRemarks: "",
      paymentProof: undefined,
    },
    mode: "all",
  });

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, []);

  const housePaymentsMonthCurVal = form.watch("housePaymentMonths");
  const housePaymentAmount = form.watch("houseLatestPaymentAmount");

  const updatePaymentMutation = useMutation({
    mutationFn: updateHousePayment,
    onError: (error) => {
      console.error(error);
      toast({
        title: "Error",
        description: "Error updating house details",
      });
    },
    onMutate: () => {
      form.reset();
      setImagePreview(null);
      setMonthsPaying([]);
      setAmountToPay(0);
      setDialogOpen(false);
      toast({
        title: "Updating payment...",
        description: "Please wait while we update the payment.",
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Payment has been recorded",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["collection"] });
      queryClient.invalidateQueries({ queryKey: ["paymentHistory"] });
    },
  });

  const onSubmit = (data: CollectionType) => {
    updatePaymentMutation.mutate({ houseId, data });
  };

  useEffect(() => {
    if (fixedDue?.total_due && form.getValues("housePaymentMonths")) {
      setAmountToPay(fixedDue.total_due * form.getValues("housePaymentMonths"));

      // Generate a list of months being paid for
      let startDate;

      if (houseLatestPayment) {
        // If there's a latest payment, start from the month after that payment
        startDate = new Date(houseLatestPayment);
        // Move to the next month
        startDate.setMonth(startDate.getMonth() + 1);
      } else {
        // If no payment history, start from current month
        startDate = new Date();
      }

      const totalMonths = form.getValues("housePaymentMonths");

      // Create an array of month names based on the number of months
      const monthsArray = Array.from({ length: totalMonths }, (_, i) => {
        const paymentDate = new Date(startDate);
        paymentDate.setMonth(startDate.getMonth() + i);

        // Format as "Month Year" to avoid confusion when spanning multiple years
        return paymentDate.toLocaleString("default", {
          month: "long",
          year: "numeric",
        });
      });

      setMonthsPaying(monthsArray);
    }
  }, [fixedDue, housePaymentsMonthCurVal, houseLatestPayment]);

  return (
    <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button>Add Payment</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-h-[80%] overflow-y-scroll">
        <AlertDialogHeader>
          <AlertDialogTitle>{familyName} Family Payment</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogBody>
          <Form {...form}>
            <form
              id="form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-2"
            >
              <FormField
                control={form.control}
                name="houseLatestPaymentAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        {...field}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Number of Months */}
              <div>
                <p className="text-sm font-normal">
                  Amount to pay: {formatAmount(amountToPay)}
                </p>
              </div>
              <FormField
                control={form.control}
                name="housePaymentMonths"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Months to Pay</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter number of months"
                        {...field}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);

                          if (value > 12) {
                            form.setError("housePaymentMonths", {
                              type: "manual",
                              message: "Maximum 12 months",
                            });
                          } else if (value < 1) {
                            form.setError("housePaymentMonths", {
                              type: "manual",
                              message: "Minimum 1 month",
                            });
                          } else {
                            field.onChange(value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-wrap gap-1 text-sm font-normal">
                Months paying for:{" "}
                {monthsPaying?.map((month) => (
                  <p key={month}>{month}, </p>
                ))}
              </div>

              <FormField
                control={form.control}
                name="housePaymentRemarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Remarks{" "}
                      <span className="font-light text-xs">(Optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="font-normal"
                        placeholder="Remarks regarding the payment"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paymentProof"
                render={({ field: { onChange } }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Payment Proof</FormLabel>
                    <FormControl>
                      <Input
                        id="file-input"
                        type="file"
                        accept="image/png, image/jpeg"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            // Create a preview of the image
                            const objectUrl = URL.createObjectURL(file);
                            setImagePreview(objectUrl);
                            onChange(file);
                          }
                        }}
                      />
                    </FormControl>
                    {imagePreview ? (
                      <div className="relative h-full min-h-[210px] w-full overflow-hidden rounded-lg">
                        <img
                          className="w-full"
                          src={imagePreview}
                          alt="Payment proof"
                        />
                        <Icon
                          onClick={() => {
                            URL.revokeObjectURL(imagePreview);
                            setImagePreview(null);
                            form.setValue("paymentProof", undefined);
                          }}
                          className="absolute right-4 top-4 text-2xl  hover:cursor-pointer hover:text-red-600"
                          icon={"mingcute:close-circle-fill"}
                        />
                      </div>
                    ) : (
                      <Label htmlFor="file-input">
                        <div className="flex h-[210px] flex-col items-center justify-center rounded-lg border border-dashed border-blue-400 hover:cursor-pointer hover:bg-blue-50">
                          <div className="flex flex-shrink-0 items-center justify-center rounded-md">
                            <Icon
                              className="h-11 w-11 text-blue-300"
                              icon={"mingcute:pic-fill"}
                            />
                          </div>
                          <p className="text-[12px] font-semibold text-blue-300">
                            Payment Proof
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
          <AlertDialogCancel onClick={() => form.reset()}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogActionNoClose
            disabled={
              housePaymentAmount !== amountToPay ||
              updatePaymentMutation.isPending
              // || (housePaymentAmount > amountToPay
            }
            type="submit"
            form="form"
          >
            Submit
          </AlertDialogActionNoClose>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CollectionForm;
