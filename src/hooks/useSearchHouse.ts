// import { useEffect, useState } from "react";
// import { useDebounce } from "./useDebounce";

// const useSearchHouse = (
//   searchParams: URLSearchParams,
//   setSearchParams: (searchParams: URLSearchParams) => void
// ) => {
//   const [searchInput, setSearchInput] = useState(
//     searchParams.get("query") || ""
//   );
//   console.log(searchInput);
//   const debouncedSearch = useDebounce(searchInput, 500);

//   // Update search params when debounced search value changes
//   useEffect(() => {
//     if (debouncedSearch) {
//       searchParams.set("query", debouncedSearch);
//     } else {
//       searchParams.delete("query");
//     }
//     setSearchParams(searchParams);
//   }, [debouncedSearch]);
//   return {
//     searchInput,
//     setSearchInput,
//   };
// };

// export default useSearchHouse;
