import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, signupType } from '@/validations/userSchema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import PasswordInput from '@/components/PasswordInput';
import BackGroundImage from '@/assets/BG.webp';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { Icon } from '@iconify/react';
import { Link, useNavigate } from 'react-router';
import { toast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { requestResidentOtp, verifyResidentOtp } from '@/services/authServices';
import { Checkbox } from '@/components/ui/checkbox';

const Signup = () => {
  const { isMobile } = useSidebar();
  const navigate = useNavigate();
  const [showOTPSection, setShowOTPSection] = useState(false);
  const [otp, setOtp] = useState('');
  const [formData, setFormData] = useState<signupType | null>(null);

  const form = useForm<signupType>({
    defaultValues: {
      userFirstName: '',
      userLastName: '',
      userEmail: '',
      userContact: '',
      houseCode: '',
      userPassword: '',
      confirmPassword: '',
      agreementAccepted: false,
    },
    resolver: zodResolver(signupSchema),
  });

  // ==========================
  // 1️⃣ Request OTP (Only email + password check)
  // ==========================
  const requestOtpMutation = useMutation({
    mutationFn: async (data: signupType) => {
      // Only send email and password to request OTP
      await requestResidentOtp(data.userEmail, data.userPassword);
      return data;
    },
    onSuccess: (data) => {
      setFormData(data); // Store all form data for later
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

  // ==========================
  // 2️⃣ Verify OTP + Complete Registration (including house code)
  // ==========================
  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      if (!formData) {
        throw new Error('Form data not found');
      }

      // Ensure userContact has a value
      const contactNumber = formData.userContact || '';

      // Now verify OTP along with all user details AND house code
      return await verifyResidentOtp(
        formData.userEmail,
        otp,
        formData.userFirstName,
        formData.userLastName,
        contactNumber,
        formData.houseCode
      );
    },
    onSuccess: () => {
      toast({
        title: 'Account Verified',
        description:
          'Your account has been successfully verified. You can now log in.',
      });
      navigate('/login', { replace: true });
      form.reset();
      setOtp('');
      setShowOTPSection(false);
      setFormData(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Verification Failed',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: signupType) => {
    if (!data.agreementAccepted) {
      toast({
        title: 'Agreement Required',
        description: 'Please accept the terms to continue.',
        variant: 'destructive',
      });
      return;
    }
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

  const handleResendOTP = () => {
    if (!formData) return;

    requestResidentOtp(formData.userEmail, formData.userPassword)
      .then(() => {
        toast({
          title: 'Code Resent',
          description: 'A new verification code was sent to your email.',
        });
      })
      .catch((error) => {
        toast({
          title: 'Error',
          description: error.message || 'Failed to resend code.',
          variant: 'destructive',
        });
      });
  };

  // ==========================
  // RENDER
  // ==========================
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center w-full overflow-y-scroll no-scrollbar">
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
            <Link to="/">
              <Icon icon="mingcute:arrow-left-line" className="w-4 h-4" />
              Back to Home
            </Link>
          )}
        </Button>
      </div>

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
            <div className="text-center space-y-2 mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                Create an Account
              </h1>
              <p className="text-sm text-gray-500">
                Fill in your details to get started
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Info */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-medium text-gray-700 mb-2">
                      Personal Information
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="userFirstName"
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
                        name="userLastName"
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
                      name="userEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="email@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="userContact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Number</FormLabel>
                          <FormControl>
                            <Input placeholder="09XXXXXXXXX" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Account Info */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-medium text-gray-700 mb-2">
                      Account Information
                    </h2>

                    <FormField
                      control={form.control}
                      name="houseCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Access Code</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your access code"
                              {...field}
                            />
                          </FormControl>
                          <p className="text-xs text-gray-500">
                            Ask your subdivision admin if you don&apos;t have
                            one.
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="userPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <PasswordInput
                              placeholder="Create password"
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
                </div>

                {/* Agreement */}
                <div className="mt-6">
                  <FormField
                    control={form.control}
                    name="agreementAccepted"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3 p-4 border rounded-md">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <p className="text-sm text-gray-700">
                          I agree to the Terms and Conditions
                        </p>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-8 space-y-4">
                  <Button
                    type="submit"
                    disabled={requestOtpMutation.isPending}
                    className="w-full py-2.5 bg-primary hover:bg-primary/90 text-white font-medium rounded-md transition-colors"
                  >
                    {requestOtpMutation.isPending
                      ? 'Sending OTP...'
                      : 'Register Account'}
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
          // OTP Section
          <div className="flex flex-col items-center space-y-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Verify Your Email
            </h1>
            <p className="text-sm text-gray-500">
              A 6-digit code has been sent to{' '}
              <span className="font-medium">{formData?.userEmail}</span>. Enter
              it below to verify your account.
            </p>

            <div className="flex justify-center space-x-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Input
                  key={i}
                  maxLength={1}
                  value={otp[i] || ''}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    const newOtp =
                      otp.substring(0, i) + val + otp.substring(i + 1);
                    setOtp(newOtp);

                    // Auto-focus next input
                    if (val && i < 5) {
                      const nextInput =
                        e.target.parentElement?.nextElementSibling?.querySelector(
                          'input'
                        );
                      nextInput?.focus();
                    }
                  }}
                  onKeyDown={(e) => {
                    // Handle backspace to go to previous input
                    if (e.key === 'Backspace' && !otp[i] && i > 0) {
                      const prevInput =
                        e.currentTarget.parentElement?.previousElementSibling?.querySelector(
                          'input'
                        );
                      prevInput?.focus();
                    }
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
              onClick={handleResendOTP}
            >
              Resend Code
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;
