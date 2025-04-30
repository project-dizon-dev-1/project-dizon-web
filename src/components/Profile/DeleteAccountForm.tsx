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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { deleteAccount } from "@/services/userServices";

import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { logout } from "@/services/authServices";

const DeleteAccountForm = ({ userId }: { userId?: string }) => {
  const navigate = useNavigate();
  const deleteSchema = z.object({
    confirm: z
      .string()
      .min(1, "Confirmation is required")
      .refine(
        (data) => {
          return data === "DELETE";
        },
        {
          message: "Please type DELETE to confirm",
        }
      ),
  });

  const form = useForm({
    resolver: zodResolver(deleteSchema),
    defaultValues: {
      confirm: "",
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      toast({
        title: "Account Deleted",
        description: "Your account has been deleted successfully.",
      });
      logout();
      navigate("/login", { replace: true });
    },
    onError: (error) => {
      toast({
        title: "Error Deleting Account",
        description: error.message,
      });
    },
  });
  const inputValue = form.watch("confirm");
  const isDeleteDisabled = inputValue !== "DELETE";

  const handleDeleteAccount = () => {
    deleteAccountMutation.mutate(userId);
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"destructive"}>Delete Account</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogBody>
          <Form {...form}>
            <form onSubmit={(e) => e.preventDefault()}>
              <FormField
                control={form.control}
                name="confirm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Type{" "}
                      <span className=" font-bold">&quot;DELETE&quot;</span> to
                      confirm
                    </FormLabel>
                    <FormControl>
                      <Input className=" border  " {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </AlertDialogBody>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => form.reset()}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogActionNoClose
            variant="destructive"
            disabled={isDeleteDisabled}
            onClick={handleDeleteAccount}
          >
            Delete Account
          </AlertDialogActionNoClose>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAccountForm;
