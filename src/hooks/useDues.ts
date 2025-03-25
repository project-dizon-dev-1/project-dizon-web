import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "./use-toast";

import { dueSchema, dueType } from "@/validations/duesSchema";
import { EditDue } from "@/types/DueTypes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addDues,
  deleteDues,
  fetchTotalDue,
  ToggleDueActivation,
  updateDues,
} from "@/services/dueServices";
import useUserContext from "./useUserContext";

const useDues = (data?: EditDue) => {
  const queryClient = useQueryClient();

  const { user } = useUserContext();

  const totalDueData = useQuery({
    queryKey: ["totalDue"],
    queryFn: async () => fetchTotalDue(),
  });

  const form = useForm({
    resolver: zodResolver(dueSchema),
    defaultValues: {
      dueName: data?.dueName ?? "",
      dueDescription: data?.dueDescription ?? "",
      dueCost: data?.dueCost ?? 0,
      // dueIsActive: data?.due_is_active ?? true,
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
        queryKey: ["duesCategories"],
      });
    },
  });

  const duesEditMutation = useMutation({
    mutationFn: ({
      dueId,
      payload,
    }: {
      dueId: string | undefined;
      payload: dueType & { userName: string; userId: string | undefined };
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
        queryKey: ["duesCategories"],
      });
      queryClient.invalidateQueries({
        queryKey: ["totalDue"],
      });
    },
  });

  const onSubmit = (formData: dueType, categoryId?: string) => {
    if (data) {
      duesEditMutation.mutate({
        dueId: data.dueId,
        payload: {
          ...formData,
          userId: user?.id,
          userName: `${user?.user_first_name} ${user?.user_last_name}`,
        },
      });
      return;
    }
    if (categoryId) {
      duesAddMutation.mutate({
        categoryId,
        formData: {
          ...formData,
          userId: user?.id,
          userName: `${user?.user_first_name} ${user?.user_last_name}`,
        },
      });
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
        queryKey: ["duesCategories"],
      });
      queryClient.invalidateQueries({
        queryKey: ["totalDue"],
      });
    },
  });

  const toggleActivateMutation = useMutation({
    mutationFn: async (data: { dueId: string; dueIsActive: boolean }) =>
      ToggleDueActivation(data.dueId, data.dueIsActive),
    onSuccess: () => {
      toast({
        title: "Due Activation Toggled Successfully",
      });
    },
    onMutate: () => {
      toast({
        title: "Toggling Activation...",
      });
    },
    onError: () => {
      toast({
        title: "Error Toggling Activation",
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["duesCategories"],
      });
      queryClient.invalidateQueries({
        queryKey: ["totalDue"],
      });
    },
  });

  return {
    form,
    onSubmit,
    totalDueData,
    deleteDuesMutation,
    toggleActivateMutation,
  };
};

export default useDues;
