type PaginatedDataType<T> = {
  items: T[]; // List of due items
  totalCount: number; // Total number of dues
  currentPage: number; // Current page number
  hasNextPage: boolean;
  pageSize: number; // Number of items per page
  totalPages: number; // Total pages available
  prevPage: number | null; // Previous page number
  nextPage: number | null; // Next page number
};
type paginatedParams ={
    page:string,
    pageSize:string
}
export type { PaginatedDataType, paginatedParams};
