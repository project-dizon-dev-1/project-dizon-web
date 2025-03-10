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
type paginatedParams ={
    page:string,
    pageSize:string
}

export type { PaginatedDataType, paginatedParams,};
