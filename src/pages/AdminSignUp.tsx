import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import PasswordInput from '@/components/PasswordInput';
import { useMutation } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import BackGroundImage from '@/assets/BG.webp';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';

// Validation schema
const adminSignupSchema = z
  .object({
    adminFirstName: z.string().min(1, 'First name is required'),
    adminLastName: z.string().min(1, 'Last name is required'),
    adminEmail: z.string().email('Invalid email address'),
    adminPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6),
    villageName: z.string().min(1, 'Village name is required'),
    villageAddress: z.string().min(1, 'Village address is required'),
    villageContact: z.string().min(1, 'Village contact number is required'),
    agreementAccepted: z
      .boolean()
      .refine((v) => v === true, 'You must accept the terms'),
  })
  .refine((data) => data.adminPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type AdminSignupType = z.infer<typeof adminSignupSchema>;

// Dummy service function
const registerAdmin = async (data: AdminSignupType) => {
  // replace with your actual API call
  return new Promise((resolve) => setTimeout(() => resolve(data), 1000));
};

const AdminSignup = () => {
  const { isMobile } = useSidebar();
  const [registeredEmail, setRegisteredEmail] = useState<string>('');
  console.log(registeredEmail);

  const form = useForm<AdminSignupType>({
    defaultValues: {
      adminFirstName: '',
      adminLastName: '',
      adminEmail: '',
      adminPassword: '',
      confirmPassword: '',
      villageName: '',
      villageAddress: '',
      villageContact: '',
      agreementAccepted: false,
    },
    resolver: zodResolver(adminSignupSchema),
  });

  const signupMutation = useMutation({
    mutationFn: registerAdmin,
    onSuccess: (data: any) => {
      setRegisteredEmail(data.adminEmail);
      form.reset();
      toast({
        title: 'Admin registered',
        description: 'Check email for confirmation',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Registration failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: AdminSignupType) => {
    signupMutation.mutate(data);
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center w-full overflow-y-scroll no-scrollbar">
      {!isMobile && (
        <div className="fixed inset-0 z-0">
          <img
            className="w-full h-full object-cover"
            src={BackGroundImage}
            alt="background"
          />
        </div>
      )}

      <div
        className={cn(
          'w-full z-50 bg-white p-8 rounded-xl overflow-y-scroll no-scrollbar max-h-dvh',
          {
            'absolute -bottom-2 -right-2 mx-auto max-w-4xl md:mx-0 shadow-lg':
              !isMobile,
            'mx-auto max-w-4xl': isMobile,
          }
        )}
      >
        <div className="text-center space-y-2 mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Register Your Village
          </h1>
          <p className="text-sm text-gray-500">
            Create an admin account and register your village details
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column - Admin Details */}
              <div className="space-y-4">
                <h2 className="text-lg font-medium text-gray-700 mb-2">
                  Admin Information
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="adminFirstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="First Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="adminLastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Last Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="adminEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="email@example.com"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="adminPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder="Create a password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder="Confirm password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Right column - Village Details */}
              <div className="space-y-4">
                <h2 className="text-lg font-medium text-gray-700 mb-2">
                  Village Information
                </h2>

                <FormField
                  control={form.control}
                  name="villageName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Village Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter village name" {...field} />
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
                        <Input placeholder="Enter village address" {...field} />
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
                          placeholder="Enter village contact number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Agreement Checkbox */}
            <div className="mt-6">
              <FormField
                control={form.control}
                name="agreementAccepted"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal text-gray-700">
                      I agree to the terms and conditions
                    </FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit button */}
            <div className="mt-8">
              <Button
                type="submit"
                disabled={signupMutation.isPending}
                className="w-full py-2.5 bg-primary hover:bg-primary/90 text-white font-medium rounded-md transition-colors"
              >
                {signupMutation.isPending
                  ? 'Registering...'
                  : 'Register Village'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AdminSignup;
