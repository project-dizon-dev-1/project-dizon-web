import { ReactNode, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addPhase, editPhase } from "@/services/subdivisionServices";
import { Input } from "@/components/ui/input";
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PhaseFormValues, phaseSchema } from "@/validations/subdivisionSchema";

const PhaseForm = ({
  id,
  name,
  children,
}: {
  id?: string;
  name?: string;
  children: ReactNode;
}) => {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const isEditing = !!id;

  const phaseForm = useForm<PhaseFormValues>({
    resolver: zodResolver(phaseSchema),
    defaultValues: {
      name: name || "",
    },
  });

  useEffect(() => {
    if (dialogOpen && isEditing) {
      phaseForm.reset({ name: name || "" });
    }
  }, [dialogOpen, isEditing, name, phaseForm]);

  const addPhaseMutation = useMutation({
    mutationFn: addPhase,
    onSuccess: () => {
      toast({
        title: "Phase created",
        description: "Phase has been created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["phases"] });
      phaseForm.reset();
      setDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to create phase",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const editPhaseMutation = useMutation({
    mutationFn: editPhase,
    onSuccess: () => {
      toast({
        title: "Phase updated",
        description: "Phase has been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["phases"] });
      phaseForm.reset();
      setDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
      });
    },
  });

  const onSubmit = async (data: PhaseFormValues) => {
    if (isEditing) {
      editPhaseMutation.mutate({ phaseId: id, data });
    } else {
      addPhaseMutation.mutate(data);
    }
  };

  const handleOpenDialog = () => {
    if (isEditing) {
      phaseForm.reset({ name: name || "" });
    } else {
      phaseForm.reset({ name: "" });
    }
    setDialogOpen(true);
  };

  return (
    <AlertDialog
      open={dialogOpen}
      onOpenChange={(open) => {
        if (open) {
          handleOpenDialog();
        } else {
          setDialogOpen(false);
        }
      }}
    >
      <AlertDialogTrigger asChild>
        <button type="button" onClick={(e) => e.stopPropagation()}>
          {children}
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="z-50">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isEditing ? "Edit Phase" : "Add New Phase"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isEditing
              ? "Update the details of this phase"
              : "Add a new phase to your subdivision"}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...phaseForm}>
          <form
            onSubmit={phaseForm.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <AlertDialogBody>
              <FormField
                control={phaseForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phase Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Phase 1"
                        {...field}
                        className="z-50 relative"
                      />
                    </FormControl>
                    <FormDescription>
                      Enter a unique name for this phase
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AlertDialogBody>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogActionNoClose type="submit">
                {isEditing ? "Update Phase" : "Add Phase"}
              </AlertDialogActionNoClose>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PhaseForm;
