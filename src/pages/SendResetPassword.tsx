import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { sendPasswordResetLink } from "@/services/userServices";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";

const SendResetPassword = () => {
  const navigate = useNavigate();
  const [cooldownActive, setCooldownActive] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const emailSchema = z.object({
    email: z
      .string()
      .email("Invalid email address")
      .min(1, "Email is required"),
  });
  const form = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const goBack = () => {
    navigate(-1);
  };

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

  const sendResetPasswordLinkMutation = useMutation({
    mutationFn: sendPasswordResetLink,
    onMutate: () => {
      toast({
        title: "Sending password reset link...",
        description: "Please wait while we send the link to your email.",
      });
    },
    onSuccess: () => {
      toast({
        title: "Password reset link sent!",
        description: "Please check your email for the link.",
      });

      setCooldownActive(true);
      setCountdown(30); // Reset the countdown
    },
    onError: (error) => {
      toast({
        title: "Error sending password reset link",
        description: error.message,
      });
    },
  });

  const onSubmit = async (data: any) => {
    sendResetPasswordLinkMutation.mutate(data.email);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center w-[450px]">
        <div className="flex flex-col items-center justify-center mb-10">
          <Icon
            className="w-24 h-24 mb-5"
            icon={"mingcute:user-question-line"}
          />
          <h1 className="text-3xl font-bold">Forgot your Password?</h1>
          <p className="text-sm text-gray-500">
            Enter your email to receive a password reset link
          </p>
        </div>
        <Form {...form}>
          <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter your email"
                      className="border rounded w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={cooldownActive}
              className="w-full mt-4 text-[default] hover:bg-transparent rounded-3xl p-5 bg-white bg-gradient-to-br from-blue-100/90 via-indigo-200/50 to-purple-200/90 "
            >
              {cooldownActive
                ? `Resend in ${countdown}s`
                : "Send Password Reset Link"}
            </Button>
          </form>
        </Form>
        <div
          onClick={goBack}
          className="flex items-center justify-center gap-1 mt-2"
        >
          <Icon
            className="hover:cursor-pointer opacity-75 w-5 h-5"
            icon={"mingcute:arrow-left-line"}
          />
          <h1 className="text-lg font-semibold hover:underline hover:cursor-pointer">
            Go to login
          </h1>
        </div>
      </div>
    </div>
  );
};

export default SendResetPassword;
