import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { loginSchema, loginType } from "@/validations/userSchema";
import { login, resendEmailConfirmation } from "@/services/authServices";
import { Link, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import PasswordInput from "@/components/PasswordInput";
import BackGroundImage from "@/assets/BG.webp";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

const Login = () => {
  const navigate = useNavigate();
  const { isMobile } = useSidebar();
  const [needsVerification, setNeedsVerification] = useState(false);
  const [cooldownActive, setCooldownActive] = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    // eslint-disable-next-line
    let timer: NodeJS.Timeout | undefined = undefined;

    if (cooldownActive && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevState) => prevState - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCooldownActive(false);
      if (timer) {
        clearInterval(timer); // Clear the interval when countdown reaches 0
      }
    }

    return () => {
      if (timer) {
        clearInterval(timer); // Clear the interval on component unmount
      }
    };
  }, [countdown, cooldownActive]);

  const form = useForm({
    defaultValues: {
      userEmail: "",
      userPassword: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: (data: loginType) => login(data),
    onSuccess: () => {
      navigate("/dashboard", { replace: true });
    },
    onError: (error) => {
      if (
        error.message?.toLowerCase().includes("email not verified") ||
        error.message?.toLowerCase().includes("email not confirmed")
      ) {
        setNeedsVerification(true);
      }

      form.setError("root", {
        message: error.message,
      });
    },
  });

  const resendConfirmationMutation = useMutation({
    mutationFn: resendEmailConfirmation,
    onSuccess: () => {
      toast({
        title: "Confirmation Email Sent",
        description: "Please check your inbox and confirm your email to login.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Resend Email",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setCooldownActive(true);
      setCountdown(60);
    },
  });

  const handleResendConfirmation = () => {
    const email = form.getValues("userEmail");
    if (email) {
      resendConfirmationMutation.mutate(email);
    } else {
      toast({
        title: "Email Required",
        description:
          "Please enter your email address to resend the confirmation.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = (data: loginType) => {
    loginMutation.mutate({
      userEmail: data.userEmail,
      userPassword: data.userPassword,
    });
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-white w-full overflow-y-scroll no-scrollbar">
      <div className="absolute top-4 left-4 z-50">
        <Button variant="ghost" size="sm" className="gap-1" asChild>
          <Link to="/">
            <Icon icon={"mingcute:arrow-left-line"} className="w-4 h-4" />
            Back to Home
          </Link>
        </Button>
      </div>

      {!isMobile && (
        <div className="fixed inset-0 z-0">
          <img
            className="w-full h-full object-cover"
            src={BackGroundImage}
            alt="background image"
          />
        </div>
      )}
      <div
        className={cn("w-full space-y-6 z-50 bg-white p-8 rounded-xl ", {
          "relative mx-auto max-w-md md:absolute md:bottom-12 md:right-32 md:mx-0 shadow-lg":
            !isMobile,
          "mx-auto max-w-md": isMobile,
        })}
      >
        <div className="flex flex-col items-center space-y-2">
          <h1 className="text-5xl font-medium tracking-tight text-primary-blue">
            GEMS
          </h1>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Login to your account
          </h1>
          <p className="text-sm text-gray-500">
            Enter your credentials to access your account
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="userEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Email</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="email"
                      placeholder="JohnDoe@example.com"
                      {...field}
                    />
                  </FormControl>
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
                      className="mb-1"
                      placeholder="Password"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            {form.formState.errors.root && (
              <div className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-md border border-red-200">
                {form.formState.errors.root.message}

                {needsVerification && (
                  <div className="mt-2 flex justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleResendConfirmation}
                      disabled={
                        resendConfirmationMutation.isPending || cooldownActive
                      }
                      className="text-sm border-green-500 text-green-600 hover:bg-green-50"
                      type="button"
                    >
                      {resendConfirmationMutation.isPending ? (
                        <>
                          <Icon
                            icon="mingcute:loading-fill"
                            className="animate-spin mr-2 h-4 w-4"
                          />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Icon
                            icon="mingcute:mail-send-fill"
                            className="mr-2 h-4 w-4"
                          />
                          {cooldownActive
                            ? `Resend in ${countdown}s`
                            : "Resend Confirmation Email"}
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}

            <Button
              variant="link"
              className="p-0 h-auto text-sm hover:underline hover:text-blue-700"
              asChild
            >
              <Link to="/reset-password">Forgot Password?</Link>
            </Button>

            <div>
              <Button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full pb-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-md transition-colors"
              >
                {loginMutation.isPending ? "Logging in..." : "Login"}
              </Button>
            </div>

            <div className="text-center text-sm text-gray-500 mt-4">
              Don&apos;t have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto text-primary font-medium hover:underline"
                asChild
              >
                <Link to="/signup">Sign up</Link>
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Login;
