import { axiosDelete, axiosGet, axiosPost, axiosPut } from "@/lib/axios";
import { DueCategoryType } from "@/types/DueTypes";

const fetchDuesCategories = async (): Promise<DueCategoryType> => {
  return await axiosGet(`/dues/category/`);
};
const addDuesCategory = async (data: { categoryName: string }) => {
  return await axiosPost(`/dues/category/add`, data);
};

const updateDuesCategory = async ({
  categoryId,
  data,
}: {
  categoryId?: string;
  data: {
    categoryName: string;
  };
}) => {
  return await axiosPut(`/dues/category/update/${categoryId}`, data);
};

const deleteDuesCategory = async (categoryId: string) => {
  return await axiosDelete(`/dues/category/delete/${categoryId}`);
};

export {
  fetchDuesCategories,
  addDuesCategory,
  updateDuesCategory,
  deleteDuesCategory,
};
