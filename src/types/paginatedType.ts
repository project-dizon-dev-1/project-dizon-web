type PaginatedDataType<T> = {
  items: T[];
  totalItems: number;
  currentPage: number;
  hasNextPage: boolean;
  pageSize: number;
  totalPages: number;
  prevPage: number | null;
  nextPage: number | null;
};
type paginatedParams = {
  month?: string | null;
  status?: string | null;
  phase?: string | null;
  query?: string | null;
  year?: string | null;
  page?: string;
  pageSize?: string;
};

export type { PaginatedDataType, paginatedParams };
