import React from "react";
import { useSearchParams } from "react-router";

const useHouseSearchParams = (
  setSearchInput: React.Dispatch<React.SetStateAction<string>>
) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedPhase = searchParams.get("phase");
  const selectedBlock = searchParams.get("block");
  const selectedStreet = searchParams.get("street");
  const selectedLot = searchParams.get("lot");

  const clearFilters = () => {
    setSearchParams({});
    setSearchInput("");
  };

  const updateParams = (key: string, value: string) => {
    searchParams.set(key, value);
    setSearchParams(searchParams);
  };
  return {
    setSearchParams,
    searchParams,
    clearFilters,
    updateParams,
    selectedPhase,
    selectedBlock,
    selectedStreet,
    selectedLot,
  };
};

export default useHouseSearchParams;
