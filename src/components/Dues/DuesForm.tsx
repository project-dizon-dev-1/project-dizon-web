import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "../ui/button";
import { DialogClose } from "../ui/dialog";
import useDues from "@/hooks/useDues";
import { EditDue } from "@/types/DueTypes";

const DuesForm = ({ data }: { data: EditDue }) => {
    
  const { onSubmit, form } = useDues(data);

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="dueName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Name</FormLabel>
                <FormControl>
                  <Input placeholder="Due Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dueDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Description" {...field} />
                </FormControl>
                <FormDescription>
                  Provide details about the due payment, such as purpose,
                  amount, or additional notes.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dueCost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <DialogClose>
              <Button type="submit">Submit</Button>
            </DialogClose>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default DuesForm;
