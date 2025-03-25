// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import useDuesCategory from "@/hooks/useDuesCategory";
// import {
//   transactionSchema,
//   TransactionType,
//   PAYMENT_METHOD_VALUES,
// } from "@/validations/transactionSchema";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Icon } from "@iconify/react/dist/iconify.js";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import { useMutation } from "@tanstack/react-query";
// import { toast } from "@/hooks/use-toast";
// import { addTransaction } from "@/services/transactionServices";
// import useUserContext from "@/hooks/useUserContext";
// import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";

// const Transactions = () => {
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const { categories } = useDuesCategory();

//   const { user } = useUserContext();

//   const form = useForm<TransactionType>({
//     resolver: zodResolver(transactionSchema),
//     defaultValues: {
//       type: "EXPENSE",
//       amount: 0,
//       category: "",
//       payment_method_type: "CASH",
//       description: "",
//       transactionProof: undefined,
//     },
//   });

//   // Watch the type field to update category options
//   const transactionType = form.watch("type");

//   const addTransactionMutation = useMutation({
//     mutationFn: addTransaction,
//     onSuccess: () => {
//       toast({
//         title: "Transaction Added Successfully",
//       });
//     },
//     onMutate: () => {
//       toast({
//         title: "Adding Transaction...",
//       });
//     },
//     onError: () => {
//       toast({
//         title: "Error Adding Transaction",
//       });
//     },
//   });

//   // Handle form submission
//   const onSubmit = async (data: TransactionType) => {
//     if (user) {
//       const dataWithId = {
//         ...data,
//         userId: user.id,
//       };
//       addTransactionMutation.mutate(dataWithId);
//     }
//     resetForm();
//   };

//   // Function to reset the form and image state
//   const resetForm = () => {
//     // Reset form with keepValues set to false and without validation
//     form.reset({
//       type: "EXPENSE",
//       amount: 0,
//       category: "CASH",
//       description: "",
//       transactionProof: undefined,
//     });

//     setImagePreview(null);
//   };

//   // Handle image removal - Fix TypeScript error
//   const handleRemoveImage = () => {
//     setImagePreview(null);

//     form.unregister("transactionProof");
//   };

//   return (
//     <div className="container p-4 mx-auto max-w-4xl overflow-y-auto no-scrollbar">

// <AlertDialogDialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen}>
//           <AlertDialogTriggerDialogTrigger asChild>
//             <Button className="flex items-center gap-2">
//               <PlusCircle className="h-4 w-4" />
//               Record Transaction
//             </Button>
//           </AlertDialogTrigger>
//           <AlertDialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
//             <AlertDialogHeader>
//               <AlertDialogTitle>Record New Transaction</DialogTitle>
//               <AlertDialogDescription>
//                 Enter the details for your new financial transaction
//               </DialogDescription>
//             </DialogHeader>
//             <TransactionForm onComplete={() => setIsTransactionDialogOpen(false)} />
//           </DialogContent>
//         </Dialog>

//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Transaction Type */}
//                 <FormField
//                   control={form.control}
//                   name="type"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="font-medium">
//                         Transaction Type <span className="text-red-500">*</span>
//                       </FormLabel>
//                       <FormControl>
//                         <Select
//                           onValueChange={field.onChange}
//                           value={field.value}
//                         >
//                           <SelectTrigger className="w-full">
//                             <SelectValue placeholder="Select transaction type" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="INCOME">Income</SelectItem>
//                             <SelectItem value="EXPENSE">Expense</SelectItem>
//                           </SelectContent>
//                         </Select>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 {/* Category - Only shown if type is selected */}
//                 {transactionType && (
//                   <FormField
//                     control={form.control}
//                     name="category"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel className="font-medium">
//                           Category <span className="text-red-500">*</span>
//                         </FormLabel>
//                         <FormControl>
//                           <Select
//                             onValueChange={field.onChange}
//                             value={field.value}
//                           >
//                             <SelectTrigger className="w-full">
//                               <SelectValue placeholder="Select category" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               {transactionType === "EXPENSE" ? (
//                                 categories?.data?.map(
//                                   (category: any, index: number) => (
//                                     <SelectItem
//                                       key={index}
//                                       value={category.name}
//                                     >
//                                       {category.name}
//                                     </SelectItem>
//                                   )
//                                 )
//                               ) : (
//                                 <>
//                                   <SelectItem value="Club House Booking">
//                                     Club House Booking
//                                   </SelectItem>
//                                   <SelectItem value="Resident Payment">
//                                     Resident Payment
//                                   </SelectItem>
//                                   <SelectItem value="Other">
//                                     Other Income
//                                   </SelectItem>
//                                 </>
//                               )}
//                             </SelectContent>
//                           </Select>
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 )}
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Amount */}
//                 <FormField
//                   control={form.control}
//                   name="amount"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="font-medium">
//                         Amount (₱) <span className="text-red-500">*</span>
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           type="number"
//                           placeholder="Enter amount"
//                           {...field}
//                           onChange={(e) => {
//                             const value =
//                               e.target.value === ""
//                                 ? 0
//                                 : parseFloat(e.target.value);
//                             field.onChange(value);
//                           }}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 {/* Payment Method */}
//                 <FormField
//                   control={form.control}
//                   name="payment_method_type"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="font-medium">
//                         Payment Method <span className="text-red-500">*</span>
//                       </FormLabel>
//                       <FormControl>
//                         <Select
//                           onValueChange={field.onChange}
//                           value={field.value}
//                         >
//                           <SelectTrigger className="w-full">
//                             <SelectValue placeholder="Select payment method" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {PAYMENT_METHOD_VALUES.map((method) => (
//                               <SelectItem key={method} value={method}>
//                                 {method.charAt(0) +
//                                   method.slice(1).toLowerCase()}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               {/* Description */}
//               <FormField
//                 control={form.control}
//                 name="description"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="font-medium">
//                       Description <span className="text-red-500">*</span>
//                     </FormLabel>
//                     <FormControl>
//                       <Textarea
//                         placeholder="Additional information about the transaction..."
//                         {...field}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <Separator className="my-4" />

//               {/* Transaction Proof (Image Upload) */}
//               <FormField
//                 control={form.control}
//                 name="transactionProof"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="font-medium">
//                       Transaction Proof <span className="text-red-500">*</span>
//                     </FormLabel>
//                     <FormControl>
//                       <Input
//                         id="file-input"
//                         type="file"
//                         accept="image/png, image/jpeg"
//                         className="hidden"
//                         onChange={(e) => {
//                           const file = e.target.files?.[0];
//                           if (file) {
//                             // Create a preview of the image
//                             const reader = new FileReader();
//                             reader.onload = (event) => {
//                               if (event.target?.result) {
//                                 setImagePreview(event.target.result as string);
//                               }
//                             };
//                             reader.readAsDataURL(file);
//                             field.onChange(file);
//                           }
//                         }}
//                       />
//                     </FormControl>

//                     {imagePreview ? (
//                       <div className="relative h-full min-h-[210px] w-full overflow-hidden rounded-lg border border-blue-100">
//                         <img
//                           className="h-full w-full object-contain"
//                           src={imagePreview}
//                           alt="Transaction proof"
//                         />
//                         <Button
//                           type="button"
//                           variant="destructive"
//                           size="icon"
//                           className="absolute right-2 top-2"
//                           onClick={handleRemoveImage}
//                         >
//                           <Icon
//                             className="h-4 w-4"
//                             icon="mingcute:close-line"
//                           />
//                         </Button>
//                       </div>
//                     ) : (
//                       <Label htmlFor="file-input">
//                         <div className="flex h-[210px] flex-col items-center justify-center rounded-lg border border-dashed border-blue-400 hover:cursor-pointer hover:bg-blue-50">
//                           <div className="flex flex-shrink-0 items-center justify-center rounded-md">
//                             <Icon
//                               className="h-11 w-11 text-blue-300"
//                               icon={"mingcute:upload-2-fill"}
//                             />
//                           </div>
//                           <p className="mt-2 text-sm font-medium text-blue-500">
//                             Click to upload transaction proof
//                           </p>
//                           <p className="text-xs text-gray-500">
//                             JPG, PNG up to 5MB
//                           </p>
//                         </div>
//                       </Label>
//                     )}
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <div className="flex justify-end gap-2 pt-4">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={resetForm}
//                   className="px-6"
//                 >
//                   Cancel
//                 </Button>
//                 <Button type="submit" className="px-8">
//                   Submit
//                 </Button>
//               </div>
//             </form>
//           </Form>

//     </div>
//   );
// };

// export default Transactions;
