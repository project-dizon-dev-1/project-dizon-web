// VillageForm.tsx
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export const villageSchema = z.object({
  villageName: z.string().min(1, 'Village name is required'),
  villageAddress: z.string().min(1, 'Village address is required'),
  villageContact: z.string().min(1, 'Village contact number is required'),
});

export type VillageFormType = z.infer<typeof villageSchema>;

export const VillageForm = ({
  onSubmit,
  isLoading,
}: {
  onSubmit: (data: VillageFormType) => void;
  isLoading?: boolean;
}) => {
  const form = useForm<VillageFormType>({
    resolver: zodResolver(villageSchema),
    defaultValues: { villageName: '', villageAddress: '', villageContact: '' },
  });

  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Request New Village
        </h2>
        <Form {...form}>
          <form
            id="village-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="villageName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Village Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter village name"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="villageAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Village Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter village address"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="villageContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter contact number"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              form="village-form"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2"
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit Request'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
