import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "./use-toast";
import { addDues, deleteDues, fetchDues, fetchTotalDue, ToggleDueActivation, updateDues } from "@/services/DuesServices";
import { dueSchema, dueType } from "@/validations/duesSchema";
import { EditDue } from "@/types/DueTypes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const useDues = (data: EditDue) => {
  const queryClient = useQueryClient();

  const duesData = useQuery({
    queryKey: ["dues"],
    queryFn: async () => fetchDues(),
  });

  const totalDueData = useQuery({
    queryKey: ["totalDue"],
    queryFn: async () => fetchTotalDue(),
  });
  
  const form = useForm({
    resolver: zodResolver(dueSchema),
    defaultValues: {
      dueName: data?.due_name ?? "",
      dueDescription: data?.due_description ?? "",
      dueCost: data?.due_cost ?? 0,
      dueIsActive: data?.due_is_active ?? true,
    },
  });

  const duesAddMutation = useMutation({
    mutationFn: addDues,
    onSuccess: () => {
      toast({
        title: "Due Added Successfully",
      });
    },
    onMutate: () => {
      toast({
        title: "Adding Dues...",
      });
    },
    onError: () => {
      toast({
        title: "Error Adding Dues",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["dues"],
      });
    },
  });

  const duesEditMutation = useMutation({
    mutationFn: ({
      dueId,
      payload,
    }: {
      dueId: string | undefined;
      payload: dueType;
    }) => updateDues(dueId, payload),
    onSuccess: () => {
      toast({
        title: "Due Edited Successfully",
      });
    },
    onMutate: () => {
      toast({
        title: "Editing Dues...",
      });
    },
    onError: () => {
      toast({
        title: "Error Editing Dues",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["dues"],
      });
      queryClient.invalidateQueries({
        queryKey: ["totalDue"],
      });
    },
  });

  const onSubmit = (formData: dueType) => {
    if (data?.id) {
      duesEditMutation.mutate({ dueId: data.id, payload: formData });
    } else {
      duesAddMutation.mutate(formData);
    }
  };

  const deleteDuesMutation = useMutation({
    mutationFn: deleteDues,
    onSuccess: () => {
      toast({
        title: "Due Deleted Successfully",
      });
    },
    onMutate: () => {
      toast({
        title: "Deleting Dues...",
      });
    },
    onError: () => {
      toast({
        title: "Error Deleting Dues",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["dues"],
      });
      queryClient.invalidateQueries({
        queryKey: ["totalDue"],
      });
    },
  });

  const deactivateMutation  = useMutation({
    mutationFn: async (data: { dueId: string; dueIsActive: boolean }) =>
      ToggleDueActivation(data.dueId, data.dueIsActive),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["dues"],
      });
      queryClient.invalidateQueries({
        queryKey: ["totalDue"],
      });
    },
  });

  return {
    form,
    onSubmit,
    duesData,
    totalDueData,
    deleteDuesMutation,
    deactivateMutation
  };
};

export default useDues;
