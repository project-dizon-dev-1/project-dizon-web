import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, signupType } from "@/validations/userSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { signup } from "@/services/authServices";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router";
import PasswordInput from "@/components/PasswordInput";
import BackGroundImage from "@/assets/BG.png";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const Signup = () => {
  const { isMobile } = useSidebar();
  const form = useForm({
    defaultValues: {
      userFirstName: "",
      userLastName: "",
      userEmail: "",
      userContact: "",
      houseCode: "",
      userPassword: "",
      confirmPassword: "",
    },
    resolver: zodResolver(signupSchema),
  });

  const signupMutation = useMutation({
    mutationFn: (data: signupType) => signup(data),
    onSuccess: () => {
      form.reset();
    },
    onError: (error: any) => {
      if (error.message) {
        form.setError("root", {
          message: error.message,
        });
      }
    },
  });

  const onSubmit = (data: signupType) => {
    signupMutation.mutate(data);
  };

  return (
    <div className="min-h-dvh h-dvh flex flex-col items-center justify-center w-full overflow-y-scroll no-scrollbar ">
      {!isMobile && <img src={BackGroundImage} alt="background image" />}
      <div
        className={cn(
          "  w-full max-w-4xl bg-white p-8 rounded-xl overflow-y-scroll no-scrollbar",
          {
            " absolute -right-3 -bottom-3 shadow-lg ": !isMobile,
          }
        )}
      >
        <div className="text-center space-y-2 mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Create an account
          </h1>
          <p className="text-sm text-gray-500">
            Fill in your details to get started
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column - Personal Details */}
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
                        <FormLabel className="text-gray-700">
                          First Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="First Name"
                            className="w-full"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="userLastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">
                          Last Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Last Name"
                            className="w-full"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="userEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="email@example.com"
                          className="w-full"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="userContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">
                        Contact Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your phone number"
                          className="w-full"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Right column - Account Details */}
              <div className="space-y-4">
                <h2 className="text-lg font-medium text-gray-700 mb-2">
                  Account Information
                </h2>

                <FormField
                  control={form.control}
                  name="houseCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">
                        Account Access Code
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your account access code"
                          className="w-full"
                          {...field}
                        />
                      </FormControl>
                      <p className="text-xs text-gray-500">
                        Contact your subdivision admin if you don&apos;t have a
                        house code
                      </p>
                      <FormMessage className="text-red-500 text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="userPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder="Create a strong password"
                          className="w-full pr-10"
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
                          className="w-full pr-10"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Submit button and messages - full width */}
            <div className="mt-8 space-y-4">
              <Button
                type="submit"
                disabled={signupMutation.isPending}
                className="w-full py-2.5 bg-primary hover:bg-primary/90 text-white font-medium rounded-md transition-colors"
              >
                {signupMutation.isPending ? "Signing Up..." : "Create Account"}
              </Button>

              <div className="text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary font-medium hover:underline"
                >
                  Login
                </Link>
              </div>

              {/* Display form-level errors */}
              {form.formState.errors.root && (
                <div className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-md border border-red-200">
                  {form.formState.errors.root.message}
                </div>
              )}

              {signupMutation.isError && !form.formState.errors.root && (
                <div className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-md border border-red-200">
                  Signup failed. Please check your details and try again.
                </div>
              )}

              {signupMutation.isSuccess && (
                <div className="text-green-500 text-sm font-medium bg-green-50 p-3 rounded-md border border-green-200">
                  Account created successfully! Confirm Your Email to be able to
                  log in.
                </div>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Signup;
