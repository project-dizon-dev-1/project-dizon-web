import { useState } from 'react';
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
import { Icon } from '@iconify/react';
import { Link, useNavigate } from 'react-router';
import { requestOtp, verifyOtp } from '@/services/authServices';

// ==========================
// Validation Schema
// ==========================
const adminSignupSchema = z
  .object({
    adminEmail: z.string().email('Invalid email address'),
    adminPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your password'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    contactNumber: z
      .string()
      .min(10, 'Enter a valid contact number')
      .regex(/^[0-9]+$/, 'Numbers only'),
  })
  .refine((data) => data.adminPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type AdminSignupType = z.infer<typeof adminSignupSchema>;

const AdminSignup = () => {
  const { isMobile } = useSidebar();
  const navigate = useNavigate();
  const [showOTPSection, setShowOTPSection] = useState(false);
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const form = useForm<AdminSignupType>({
    defaultValues: {
      adminEmail: '',
      adminPassword: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      contactNumber: '',
    },
    resolver: zodResolver(adminSignupSchema),
  });

  // ==========================
  // 1️⃣ Request OTP
  // ==========================
  const requestOtpMutation = useMutation({
    mutationFn: async (data: AdminSignupType) => {
      await requestOtp(data.adminEmail, data.adminPassword);
      return data;
    },
    onSuccess: (data) => {
      setEmail(data.adminEmail);
      setPassword(data.adminPassword);
      setShowOTPSection(true);
      toast({
        title: 'Verification Code Sent',
        description: 'A 6-digit code has been sent to your email.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error Sending OTP',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      const { firstName, lastName, contactNumber } = form.getValues();
      return await verifyOtp(email, otp, firstName, lastName, contactNumber);
    },
    onSuccess: (data) => {
      toast({
        title: 'Account Verified',
        description: 'Your admin account has been successfully verified.',
      });

      // 🧭 Navigate based on role
      if (data?.role === 'superadmin') {
        navigate('/village-dashboard', { replace: true });
      } else if (data?.role === 'admin' || data?.role === 'resident') {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/residents', { replace: true });
      }

      setShowOTPSection(false);
      form.reset();
      setOtp('');
    },
    onError: (error: any) => {
      toast({
        title: 'Invalid Code',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: AdminSignupType) => {
    requestOtpMutation.mutate(data);
  };

  const handleOTPSubmit = () => {
    if (otp.length !== 6) {
      toast({
        title: 'Invalid OTP',
        description: 'Please enter all 6 digits.',
        variant: 'destructive',
      });
      return;
    }
    verifyOtpMutation.mutate();
  };

  // ==========================
  // RENDER
  // ==========================
  return (
    <div className="min-h-screen flex flex-col items-center justify-center w-full overflow-y-scroll no-scrollbar">
      {/* 🔙 Back Button */}
      <div className="absolute top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1"
          onClick={() => {
            if (showOTPSection) setShowOTPSection(false);
          }}
          asChild={!showOTPSection}
        >
          {showOTPSection ? (
            <>
              <Icon icon="mingcute:arrow-left-line" className="w-4 h-4" />
              Back
            </>
          ) : (
            <Link to="/login">
              <Icon icon="mingcute:arrow-left-line" className="w-4 h-4" />
              Back to Login
            </Link>
          )}
        </Button>
      </div>

      {/* 🌄 Background */}
      {!isMobile && (
        <div className="fixed inset-0 z-0">
          <img
            className="w-full h-full object-cover"
            src={BackGroundImage}
            alt="background"
          />
        </div>
      )}

      {/* 🧩 Card Container */}
      <div
        className={cn(
          'w-full z-50 bg-white p-8 rounded-xl overflow-y-auto no-scrollbar max-h-[90vh]',
          {
            'absolute bottom-4 right-4 mx-auto max-w-4xl md:mx-0 shadow-lg':
              !isMobile,
            'mx-auto max-w-md': isMobile,
          }
        )}
      >
        {!showOTPSection ? (
          <>
            {/* Header */}
            <div className="text-center space-y-2 mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                Admin Registration
              </h1>
              <p className="text-sm text-gray-500">
                Fill in your details to create an admin account
              </p>
            </div>

            {/* Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left column */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-medium text-gray-700 mb-2">
                      Personal Information
                    </h2>

                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">
                            First Name
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Enter first name" {...field} />
                          </FormControl>
                          <FormMessage className="text-red-500 text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">
                            Last Name
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Enter last name" {...field} />
                          </FormControl>
                          <FormMessage className="text-red-500 text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">
                            Contact Number
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="09XXXXXXXXX" {...field} />
                          </FormControl>
                          <FormMessage className="text-red-500 text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Right column */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-medium text-gray-700 mb-2">
                      Account Details
                    </h2>

                    <FormField
                      control={form.control}
                      name="adminEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="email@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="adminPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">
                            Password
                          </FormLabel>
                          <FormControl>
                            <PasswordInput
                              placeholder="Enter your password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">
                            Confirm Password
                          </FormLabel>
                          <FormControl>
                            <PasswordInput
                              placeholder="Confirm your password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <Button
                    type="submit"
                    disabled={requestOtpMutation.isPending}
                    className="w-full py-2.5 bg-primary hover:bg-primary/90 text-white font-medium rounded-md transition-colors"
                  >
                    {requestOtpMutation.isPending
                      ? 'Sending OTP...'
                      : 'Register Admin'}
                  </Button>

                  <div className="text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <Button
                      variant="link"
                      className="p-0 h-auto text-primary font-medium hover:underline"
                      asChild
                    >
                      <Link to="/login">Login</Link>
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </>
        ) : (
          // ================================
          // OTP Section
          // ================================
          <div className="flex flex-col items-center space-y-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Verify Your Email
            </h1>
            <p className="text-sm text-gray-500">
              A 6-digit code has been sent to{' '}
              <span className="font-medium">{email}</span>. Enter it below to
              verify your account.
            </p>

            <div className="flex justify-center space-x-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Input
                  key={i}
                  maxLength={1}
                  value={otp[i] || ''}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    const newOtp =
                      otp.substring(0, i) + value + otp.substring(i + 1);
                    setOtp(newOtp);
                  }}
                  className="w-10 text-center text-lg font-semibold"
                />
              ))}
            </div>

            <Button
              onClick={handleOTPSubmit}
              disabled={verifyOtpMutation.isPending}
              className="w-full py-2.5 bg-primary hover:bg-primary/90 text-white font-medium rounded-md transition-colors"
            >
              {verifyOtpMutation.isPending ? 'Verifying...' : 'Verify Code'}
            </Button>

            <Button
              variant="link"
              className="text-sm text-primary"
              onClick={() => {
                requestOtp(email, password);
                toast({
                  title: 'Code Resent',
                  description:
                    'A new verification code was sent to your email.',
                });
              }}
            >
              Resend Code
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSignup;
