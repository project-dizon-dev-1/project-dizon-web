// import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useMutation } from "@tanstack/react-query";
// import useUserContext from "@/hooks/useUserContext";
// import { toast } from "@/hooks/use-toast";
// import { Button } from "@/components/ui/button";
// import {
//   AlertDialog,
//   AlertDialogActionNoClose,
//   AlertDialogBody,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Icon } from "@iconify/react/dist/iconify.js";
// import { updateUserPassword } from "@/services/userServices";
// import {
//   PasswordFormValues,
//   passwordSchema,
//   RecoveryFormValues,
//   recoverySchema,
// } from "@/validations/userSchema";
// import PasswordInput from "../PasswordInput";
// import { supabase } from "@/services/supabaseClient";

// const EditPasswordForm = () => {
//   const [mode, setMode] = useState("reset");
//   const [open, setOpen] = useState(false);
//   const { user } = useUserContext();

//   useEffect(() => {
//     const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
//       if (event === "PASSWORD_RECOVERY") {
//         toast({
//           title: "Password Recovery Required",
//           description: "Please set a new password for your account.",
//         });
//         setMode("recover");
//       }
//     });

//     // Clean up the subscription
//     return () => {
//       authListener.subscription.unsubscribe();
//     };
//   }, []);
//   const schema = mode === "reset" ? passwordSchema : recoverySchema;
//   const defaultValues =
//     mode === "reset"
//       ? {
//           currentPassword: "",
//           newPassword: "",
//           confirmPassword: "",
//         }
//       : {
//           newPassword: "",
//           confirmPassword: "",
//         };

//   // Setup form with empty default values
//   const form = useForm({
//     resolver: zodResolver(schema),
//     defaultValues: defaultValues,
//   });

//   // Mutation for updating password
//   const updatePasswordMutation = useMutation({
//     mutationFn: (data: PasswordFormValues | RecoveryFormValues) => {
//       return updateUserPassword({
//         email: user?.user_email,
//         currentPassword:
//           "currentPassword" in data ? data.currentPassword : undefined,
//         newPassword: data.newPassword,
//       });
//     },
//     onSuccess: () => {
//       toast({
//         title: "Password Updated",
//         description: "Your password has been successfully changed.",
//       });

//       setOpen(false);
//       form.reset();
//     },
//     onError: (error: any) => {
//       // Extract the error message
//       const errorMessage = error?.message || "Failed to update password";

//       toast({
//         title: "Update Failed",
//         description: errorMessage,
//         variant: "destructive",
//       });
//     },
//   });

//   // Form submission handler
//   const onSubmit = (data: any) => {
//     if (mode === "reset") {
//       updatePasswordMutation.mutate(data as PasswordFormValues);
//     } else {
//       updatePasswordMutation.mutate(data as RecoveryFormValues);
//     }
//   };

//   return (
//     <AlertDialog open={open} onOpenChange={setOpen}>
//       <AlertDialogTrigger asChild>
//         <Button variant="outline" className="flex items-center">
//           <Icon icon="mingcute:lock-line" className="mr-2 h-4 w-4" />
//           Change Password
//         </Button>
//       </AlertDialogTrigger>
//       <AlertDialogContent className="sm:max-w-[425px]">
//         <AlertDialogHeader>
//           <AlertDialogTitle>Change Password</AlertDialogTitle>
//           <AlertDialogDescription>
//             For security, please enter your current password before setting a
//             new one.
//           </AlertDialogDescription>
//         </AlertDialogHeader>

//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//             <div className="space-y-4">
//               <AlertDialogBody>
//                 {/* Current Password Field */}
//                 {mode === "reset" && (
//                   <FormField
//                     control={form.control}
//                     name="currentPassword"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Current Password</FormLabel>
//                         <FormControl>
//                           <PasswordInput
//                             placeholder="Enter current password"
//                             {...field}
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 )}
//                 {/* New Password Field */}
//                 <FormField
//                   control={form.control}
//                   name="newPassword"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>New Password</FormLabel>
//                       <FormControl>
//                         <PasswordInput
//                           placeholder="Enter new password"
//                           {...field}
//                         />
//                       </FormControl>
//                       <p className="text-xs text-muted-foreground">
//                         Password must be at least 6 characters and include
//                         uppercase, lowercase and a number.
//                       </p>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 {/* Confirm Password Field */}
//                 <FormField
//                   control={form.control}
//                   name="confirmPassword"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Confirm Password</FormLabel>
//                       <FormControl>
//                         <PasswordInput
//                           placeholder="Confirm new password"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </AlertDialogBody>
//             </div>

//             <AlertDialogFooter className="mt-6">
//               <AlertDialogCancel>Cancel</AlertDialogCancel>
//               <AlertDialogActionNoClose
//                 type="submit"
//                 disabled={updatePasswordMutation.isPending}
//                 className="w-full"
//               >
//                 {updatePasswordMutation.isPending ? (
//                   <div className="flex items-center">
//                     <Icon
//                       icon="mingcute:loading-fill"
//                       className="mr-2 h-4 w-4 animate-spin"
//                     />
//                     Updating...
//                   </div>
//                 ) : (
//                   "Update Password"
//                 )}
//               </AlertDialogActionNoClose>
//             </AlertDialogFooter>
//           </form>
//         </Form>
//       </AlertDialogContent>
//     </AlertDialog>
//   );
// };

// export default EditPasswordForm;
