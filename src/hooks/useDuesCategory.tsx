import {
  addDuesCategory,
  deleteDuesCategory,
  fetchDuesCategories,
  updateDuesCategory,
} from '@/services/duesCategoryService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from './use-toast';

const useDuesCategory = (villageId: string) => {
  const queryClient = useQueryClient();

  const categories = useQuery({
    queryKey: ['duesCategories', villageId],
    queryFn: () => fetchDuesCategories(villageId),
    enabled: !!villageId, // only runs when villageId is available
  });

  const addCategoryMutation = useMutation({
    mutationFn: (categoryData: {
      categoryName: string;
      categoryType: 'EXPENSE' | 'INCOME';
      userId: string | undefined;
      userName: string;
    }) => {
      if (!villageId) throw new Error('Village ID is required');
      return addDuesCategory({ ...categoryData, villageId });
    },
    onSuccess: () => {
      toast({ title: 'Category Added Successfully' });
    },
    onMutate: () => {
      toast({ title: 'Adding Category...' });
    },
    onError: (error) => {
      toast({
        title: 'Error Adding Category',
        description: error.message || 'Unknown error',
        variant: 'destructive',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['duesCategories'] });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: updateDuesCategory,
    onSuccess: () => {
      toast({
        title: 'Category Updated Successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error Updating Category',
        description: error.message || 'Unknown error',
        variant: 'destructive',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['duesCategories'],
      });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteDuesCategory,
    onSuccess: () => {
      toast({
        title: 'Category Deleted Successfully',
      });
    },
    onMutate: () => {
      toast({
        title: 'Deleting Category...',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error Deleting Category',
        description: error.message || 'Unknown error',
        variant: 'destructive',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['duesCategories'],
      });
    },
  });

  return {
    categories,
    addCategoryMutation,
    updateCategoryMutation,
    deleteCategoryMutation,
  };
};

export default useDuesCategory;
