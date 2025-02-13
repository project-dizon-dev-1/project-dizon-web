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
import { useMutation, useQuery } from "@tanstack/react-query";
import { addMultipleDues, fetchFixedDue } from "@/services/DuesServices";
import { updateHousePayment } from "@/services/houseServices";

const CollectionForm = ({ houseId }: { houseId: string }) => {
  const [amountToPay, setAmountToPay] = useState<number>(0);

  const { data: fixedDue } = useQuery({
    queryKey: ["fixedDue"],
    queryFn: fetchFixedDue,
  });
  const form = useForm({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      houseLatestPaymentAmount: 0,
      housePaymentMonths: 1, 
    },
  });

  const housePaymentsMonthCurVal =  form.watch("housePaymentMonths");

  const addMultipleDuesMutation = useMutation({
    mutationFn: addMultipleDues,
  });

  const updatePaymentMutation = useMutation({
    mutationFn: updateHousePayment,
    onSuccess: () => {
      // Once house payment update is successful, add multiple dues
      addMultipleDuesMutation.mutate({
        houseId,
        data: {
          houseLatestPaymentAmount: form.getValues("houseLatestPaymentAmount"),
          housePaymentMonths: form.getValues("housePaymentMonths"),
        },
      });
    },
  });
  const onSubmit = (data: CollectionType) => {
    updatePaymentMutation.mutate({ houseId, data });
  };
  useEffect(() => {
    if (fixedDue?.total_due && form.getValues("housePaymentMonths")) {
      setAmountToPay(fixedDue.total_due * form.getValues("housePaymentMonths"));
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
        {/* Number of Months */}
        <div>
          {fixedDue?.total_due && (
            <p className=" text-sm">Amount to pay: {amountToPay}</p>
          )}
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
        <div className="flex justify-end">
          <DialogClose asChild>
            <Button
              //   disabled={form.watch("amount") !== amountToPay}
              type="submit"
            >
              Submit
            </Button>
          </DialogClose>
        </div>
      </form>
    </Form>
  );
};

export default CollectionForm;
