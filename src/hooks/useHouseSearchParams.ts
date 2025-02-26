import { useSearchParams } from "react-router";

const useHouseSearchParams = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const selectedPhase = searchParams.get("phase");
    const selectedBlock = searchParams.get("block");
    const selectedStreet = searchParams.get("street");
    const selectedLot = searchParams.get("lot");


    const clearFilters = () => {
        setSearchParams({});
      };
    
      const updateParams = (key: string, value: string) => {
        searchParams.set(key, value);
        setSearchParams(searchParams);
      };
  return {
    clearFilters,
    updateParams,
    selectedPhase,
    selectedBlock,
    selectedStreet,
    selectedLot
  };
};


export default useHouseSearchParams;