import { axiosDelete, axiosGet, axiosPost, axiosPut } from "@/lib/axios";
import { DueCategoryType } from "@/types/DueTypes";

const fetchDuesCategories = async (): Promise<DueCategoryType> => {
  return await axiosGet(`/dues/category/`);
};
const addDuesCategory = async (data: {
  categoryName: string;
  categoryType: "EXPENSE" | "INCOME";
  userId: string | undefined;
  userName: string;
}) => {
  return await axiosPost(`/dues/category/add`, data);
};

const updateDuesCategory = async ({
  categoryId,
  data,
}: {
  categoryId?: string;
  data: {
    categoryName: string;
    userId: string | undefined;
    userName: string;
  };
}) => {
  return await axiosPut(`/dues/category/update/${categoryId}`, data);
};

const deleteDuesCategory = async ({
  categoryId,
  data,
}: {
  categoryId: string;
  data: { userId: string | undefined; userName: string };
}) => {
  return await axiosDelete(`/dues/category/delete/${categoryId}`, data);
};

export {
  fetchDuesCategories,
  addDuesCategory,
  updateDuesCategory,
  deleteDuesCategory,
};
