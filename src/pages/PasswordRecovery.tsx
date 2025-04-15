import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icon } from "@iconify/react/dist/iconify.js";
import { updateUserPassword } from "@/services/userServices";
import PasswordInput from "@/components/PasswordInput";
import {
  PasswordFormValues,
  passwordSchema,
  RecoveryFormValues,
  recoverySchema,
} from "@/validations/userSchema";
import useUserContext from "@/hooks/useUserContext";
import { supabase } from "@/services/supabaseClient";

// Define the possible modes for the form
type FormMode = "reset" | "recovery";

const PasswordRecovery = () => {
  const [mode, setMode] = useState<FormMode>("reset");
  const { user } = useUserContext();

  // Check for recovery mode indicators
  useEffect(() => {
    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setMode("recovery");
        toast({
          title: "Password Reset Required",
          description: "Please set a new password for your account",
        });
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Select schema based on mode
  const schema = mode === "reset" ? passwordSchema : recoverySchema;

  // Set default values based on mode
  const defaultValues =
    mode === "reset"
      ? {
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }
      : {
          newPassword: "",
          confirmPassword: "",
        };

  // Setup form with mode-specific schema and defaults
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // Reset form when mode changes
  useEffect(() => {
    form.reset(defaultValues);
  }, [mode, form]);

  // Password update mutation
  const updatePasswordMutation = useMutation({
    mutationFn: (data: PasswordFormValues | RecoveryFormValues) => {
      return updateUserPassword({
        email: user?.user_email,
        // Only pass currentPassword in reset mode
        currentPassword:
          "currentPassword" in data ? data.currentPassword : undefined,
        newPassword: data.newPassword,
      });
    },
    onSuccess: () => {
      toast({
        title:
          mode === "recovery"
            ? "Password Reset Successful"
            : "Password Updated",
        description: "Your password has been successfully changed.",
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.message || "Failed to update password";
      toast({
        title: "Update Failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  // Form submission handler
  const onSubmit = (data: any) => {
    updatePasswordMutation.mutate(data);
  };

  return (
    <div className="flex items-center justify-center  p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Icon
              icon="mingcute:lock-line"
              className="h-12 w-12 text-primary"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            {mode === "recovery" ? "Reset Your Password" : "Change Password"}
          </CardTitle>
          <CardDescription className="text-center">
            {mode === "recovery"
              ? "Create a new password for your account"
              : "Update your password by entering your current password first"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-4">
                {/* Current Password Field - only shown in reset mode */}
                {mode === "reset" && (
                  <FormField
                    control={form.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <PasswordInput
                            placeholder="Enter current password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* New Password Field */}
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder="Enter new password"
                          {...field}
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground">
                        {mode === "reset"
                          ? "Password must be at least 6 characters and include uppercase, lowercase and a number."
                          : "Password must be at least 8 characters and include uppercase, lowercase, number and special character."}
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirm Password Field */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder="Confirm new password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {mode === "recovery" && (
                  <div className="bg-blue-50 border border-blue-100 rounded p-3">
                    <p className="text-sm text-blue-800 flex items-center">
                      <Icon
                        icon="mingcute:information-line"
                        className="mr-1 h-4 w-4"
                      />
                      You must set a new password to continue using your
                      account.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex space-x-2 justify-end">
                <Button
                  type="submit"
                  className={mode === "recovery" ? "w-full" : ""}
                  disabled={updatePasswordMutation.isPending}
                >
                  {updatePasswordMutation.isPending ? (
                    <div className="flex items-center justify-center">
                      <Icon
                        icon="mingcute:loading-fill"
                        className="mr-2 h-4 w-4 animate-spin"
                      />
                      {mode === "recovery"
                        ? "Resetting Password..."
                        : "Updating Password..."}
                    </div>
                  ) : mode === "recovery" ? (
                    "Reset Password"
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordRecovery;
