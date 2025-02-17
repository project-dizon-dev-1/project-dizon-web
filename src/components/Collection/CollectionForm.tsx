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
import { DialogClose } from "../ui/dialog";
import { Button } from "../ui/button";
import {
  collectionSchema,
  CollectionType,
} from "@/validations/collectionSchema";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addMultipleDues, fetchFixedDue } from "@/services/DuesServices";
import { updateHousePayment } from "@/services/houseServices";
import { Textarea } from "../ui/textarea";
import { toast } from "@/hooks/use-toast";

const CollectionForm = ({ houseId }: { houseId: string }) => {
  const [amountToPay, setAmountToPay] = useState<number>(0);
  const [monthsPaying, setMonthsPaying] = useState<string[]>([]);
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
    },
  });

  const housePaymentsMonthCurVal = form.watch("housePaymentMonths");
  const housePaymentAmount = form.watch("houseLatestPaymentAmount");

  const addMultipleDuesMutation = useMutation({
    mutationFn: addMultipleDues,
    onError: () => {
      toast({
        title: "Error",
        description: "Error adding payment to history",
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Payment has been added to history",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentHistory"] });
    },
  });

  const updatePaymentMutation = useMutation({
    mutationFn: updateHousePayment,
    onError: () => {
      toast({
        title: "Error",
        description: "Error updating house details",
      });
    },

    onSuccess: () => {
      // Once house payment update is successful, add multiple dues
      toast({
        title: "Success",
        description: "Payment has been recorded",
      });
      addMultipleDuesMutation.mutate({
        houseId,
        data: {
          houseLatestPaymentAmount: form.getValues("houseLatestPaymentAmount"),
          housePaymentMonths: form.getValues("housePaymentMonths"),
          housePaymentRemarks: form.getValues("housePaymentRemarks")
        },
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["collection"] });
    },
  });
  const onSubmit = (data: CollectionType) => {
    updatePaymentMutation.mutate({ houseId, data });
  };
  useEffect(() => {
    if (fixedDue?.total_due && form.getValues("housePaymentMonths")) {
      setAmountToPay(fixedDue.total_due * form.getValues("housePaymentMonths"));

      // Generate a list of months being paid for
      const currentMonth = new Date().getMonth(); // Get the current month (0-based)
      const totalMonths = form.getValues("housePaymentMonths");

      // Create an array of month names based on the number of months
      const monthsArray = Array.from({ length: totalMonths }, (_, i) => {
        const monthIndex = (currentMonth + i) % 12; // Wrap around after December
        return new Date(0, monthIndex).toLocaleString("default", {
          month: "long",
        });
      });

      setMonthsPaying(monthsArray);
    }
  }, [fixedDue, housePaymentsMonthCurVal]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
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
          <p className=" text-sm font-normal">Amount to pay: {amountToPay.toLocaleString("en-PH")} ₱</p>
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
                    if (value >= 1) {
                      field.onChange(value);
                    } else {
                      field.onChange(1);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className=" flex flex-wrap gap-1 text-sm font-normal">
          Months paying for :{" "}
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
                Remarks <span className=" font-light text-xs">(Optional)</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  className=" font-normal"
                  placeholder="Remarks regarding the payment"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <DialogClose asChild>
            <Button disabled={housePaymentAmount !== amountToPay && housePaymentsMonthCurVal > 1} type="submit">
              Submit
            </Button>
          </DialogClose>
        </div>
      </form>
    </Form>
  );
};

export default CollectionForm;
