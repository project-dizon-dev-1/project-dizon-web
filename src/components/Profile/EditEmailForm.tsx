import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Icon } from "@iconify/react/dist/iconify.js";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogActionNoClose,
  AlertDialogBody,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { sendChangeEmailVerification } from "@/services/userServices";

// Define email validation schema
const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type EmailFormValues = z.infer<typeof emailSchema>;

const EditEmailForm = () => {
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [cooldownActive, setCooldownActive] = useState(false);
  const [countdown, setCountdown] = useState(30);



  // Email change mutation
  const emailChangeMutation = useMutation({
    mutationFn: (data: EmailFormValues) =>
      sendChangeEmailVerification(data.email),
    onSuccess: () => {
      toast({
        title: "Verification Email Sent",
        description:
          "Please check both your current and new email inboxes for verification links.",
      });
      // Start cooldown timer
      setCooldownActive(true);
      setCountdown(30);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error?.message ||
          "Failed to send verification email. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Form setup with validation
  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  // Countdown timer effect
  useEffect(() => {
    // eslint-disable-next-line
    let timer: NodeJS.Timeout | null = null;

    if (cooldownActive && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCooldownActive(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [cooldownActive, countdown]);

  // Reset cooldown when dialog is closed
  useEffect(() => {
    if (!isEmailDialogOpen) {
      setCooldownActive(false);
      setCountdown(30);
    }
  }, [isEmailDialogOpen]);

  // Form submission handler
  const handleSendEmailVerification = (data: EmailFormValues) => {
    if (!cooldownActive) {
      emailChangeMutation.mutate(data);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsEmailDialogOpen(true)}
        className="flex items-center"
      >
        <Icon icon="mingcute:mail-line" className="mr-2 h-4 w-4" />
        Change Email
      </Button>

      <AlertDialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Change Email Address</AlertDialogTitle>
            <AlertDialogDescription className="text-xs">
              When you click &apos;Send Verification&apos;, we&apos;ll email
              verification links to both your current and new email addresses.
              You must click the links in both emails to complete the change.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <Form {...emailForm}>
            <form
              onSubmit={emailForm.handleSubmit(handleSendEmailVerification)}
              className="space-y-4"
            >
              <AlertDialogBody>
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Email Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your new email address"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {cooldownActive && (
                  <div className="mt-4 p-2 bg-amber-50 border border-amber-200 rounded-md">
                    <p className="text-sm text-amber-700 flex items-center">
                      <Icon
                        icon="mingcute:time-line"
                        className="mr-2 h-4 w-4"
                      />
                      You can resend in {countdown} second
                      {countdown !== 1 ? "s" : ""}
                    </p>
                  </div>
                )}
              </AlertDialogBody>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogActionNoClose
                  type="submit"
                  className="w-full"
                  disabled={emailChangeMutation.isPending || cooldownActive}
                >
                  {emailChangeMutation.isPending ? (
                    <div className="flex items-center">
                      <Icon
                        icon="mingcute:loading-fill"
                        className="mr-2 h-4 w-4 animate-spin"
                      />
                      Sending Verification...
                    </div>
                  ) : cooldownActive ? (
                    <div className="flex items-center">
                      <Icon
                        icon="mingcute:time-fill"
                        className="mr-2 h-4 w-4"
                      />
                      Wait {countdown}s
                    </div>
                  ) : (
                    "Send Verification"
                  )}
                </AlertDialogActionNoClose>
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EditEmailForm;
