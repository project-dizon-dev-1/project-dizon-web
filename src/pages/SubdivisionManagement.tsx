import Loading from "@/components/Loading";
import { useSearchParams } from "react-router";
import {
  deleteBlock,
  deleteLot,
  deletePhase,
  deleteStreet,
  fetchAllPhases,
  fetchBlocksByPhase,
  fetchLotsByBlock,
  fetchStreetsByPhase,
} from "@/services/subdivisionServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PhaseForm from "@/components/Subdivision/PhaseForm";
import StreetForm from "@/components/Subdivision/StreetForm";
import BlockForm from "@/components/Subdivision/BlockForm";
import LotForm from "@/components/Subdivision/LotForm";
import { Sheet, SheetContent } from "@/components/ui/sheet";

import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import SubdivisionColumn from "@/components/Subdivision/SubdivisionColumn";
import { useSidebar } from "@/components/ui/sidebar";

const SubdivisionManagement = () => {
  const { isMobile } = useSidebar();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [params, setParams] = useSearchParams();

  const { data: phases, isLoading } = useQuery({
    queryKey: ["phases"],
    queryFn: fetchAllPhases,
  });

  const { data: streets, isLoading: streetsLoading } = useQuery({
    queryKey: ["streets", params.get("phaseId")],
    queryFn: async () => await fetchStreetsByPhase(params.get("phaseId")),
    enabled: !!params.get("phaseId"),
  });

  const { data: blocks, isLoading: blocksLoading } = useQuery({
    queryKey: ["blocks", params.get("phaseId")],
    queryFn: async () => await fetchBlocksByPhase(params.get("phaseId")),
    enabled: !!params.get("phaseId"),
  });

  const { data: lots, isLoading: lotsLoading } = useQuery({
    queryKey: ["lots", params.get("blockId")],
    queryFn: async () => await fetchLotsByBlock(params.get("blockId")),
    enabled: !!params.get("blockId"),
  });

  const handlePhaseClick = (phaseId: string) => {
    // Create a completely new URLSearchParams object with just the phaseId
    const newParams = new URLSearchParams();
    newParams.set("phaseId", phaseId);
    setParams(newParams);
  };

  const handleStreetClick = (streetId: string) => {
    // When clicking a street, we want to keep the phaseId but remove blockId and lotId
    const newParams = new URLSearchParams();
    newParams.set("phaseId", params.get("phaseId") || "");
    newParams.set("streetId", streetId);
    setParams(newParams);
  };

  const handleBlockClick = (blockId: string) => {
    // When clicking a block, we want to keep the phaseId but remove lotId
    const newParams = new URLSearchParams();
    newParams.set("phaseId", params.get("phaseId") || "");
    newParams.set("streetId", params.get("streetId") || "");
    newParams.set("blockId", blockId);
    setParams(newParams);
  };
  const deletePhaseMutation = useMutation({
    mutationFn: deletePhase,
    onSuccess: () => {
      toast({
        title: "Phase deleted",
        description: "Phase has been deleted successfully",
      });
      queryClient.invalidateQueries({
        queryKey: ["phases"],
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setDeleteDialogOpen(false);
    },
  });
  const handleDeletePhase = async (phaseId: string) => {
    deletePhaseMutation.mutate(phaseId);
  };

  const deleteStreetMutation = useMutation({
    mutationFn: deleteStreet,
    onSuccess: () => {
      toast({
        title: "Street deleted",
        description: "Street has been deleted successfully",
      });
      queryClient.invalidateQueries({
        queryKey: ["streets", params.get("phaseId")],
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setDeleteDialogOpen(false);
    },
  });

  const handleDeleteStreet = async (streetId: string) => {
    deleteStreetMutation.mutate(streetId);
  };
  const deleteBlockMutation = useMutation({
    mutationFn: deleteBlock,
    onSuccess: () => {
      toast({
        title: "Block deleted",
        description: "Block has been deleted successfully",
      });
      queryClient.invalidateQueries({
        queryKey: ["blocks", params.get("phaseId")],
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setDeleteDialogOpen(false);
    },
  });

  const handleDeleteBlock = async (blockId: string) => {
    deleteBlockMutation.mutate(blockId);
  };

  const deleteLotMutation = useMutation({
    mutationFn: deleteLot,
    onSuccess: () => {
      toast({
        title: "Lot deleted",
        description: "Lot has been deleted successfully",
      });
      queryClient.invalidateQueries({
        queryKey: ["lots", params.get("blockId")],
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setDeleteDialogOpen(false);
    },
  });

  const handleDeleteLot = async (lotId: string) => {
    deleteLotMutation.mutate(lotId);
  };

  if (isLoading && phases) {
    return <Loading />;
  }

  return (
    <div className="bg-white flex rounded-xl h-full">
      {/* Phases Column */}
      <SubdivisionColumn
        title={"Phases"}
        FormComponent={PhaseForm}
        childExist={!!phases}
        data={phases}
        setParams={handlePhaseClick}
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        handleDeleteData={handleDeletePhase}
        loading={isLoading}
        deleteMessage={
          "This action cannot be undone. This will permanently delete your phase and all the streets, blocks, and lots in this phase."
        }
        queryParamsKey="phaseId"
      />

      {/* Streets Column */}
      {(streets || streetsLoading) && !isMobile && (
        <SubdivisionColumn
          title={"Streets"}
          FormComponent={StreetForm}
          childExist={!!streets}
          data={streets}
          setParams={handleStreetClick}
          deleteDialogOpen={deleteDialogOpen}
          setDeleteDialogOpen={setDeleteDialogOpen}
          handleDeleteData={handleDeleteStreet}
          loading={streetsLoading}
          deleteMessage={
            "This action cannot be undone. This will permanently delete your street and all the blocks and lots in this street."
          }
          queryParamsKey="streetId"
        />
      )}
      {isMobile && (streets || streetsLoading) && (
        <Sheet
          open={!!streets}
          onOpenChange={(open) => {
            if (!open) {
              setParams();
            }
          }}
        >
          <SheetContent className="w-full  sm:max-w-full sm:w-full md:max-w-full ">
            <SubdivisionColumn
              title={"Streets"}
              FormComponent={StreetForm}
              childExist={!!streets}
              data={streets}
              setParams={handleStreetClick}
              deleteDialogOpen={deleteDialogOpen}
              setDeleteDialogOpen={setDeleteDialogOpen}
              handleDeleteData={handleDeleteStreet}
              loading={streetsLoading}
              deleteMessage={
                "This action cannot be undone. This will permanently delete your street and all the blocks and lots in this street."
              }
              queryParamsKey="streetId"
            />
          </SheetContent>
        </Sheet>
      )}
      {/* Street Mobile View */}

      {/* Blocks Column */}
      {(blocks || blocksLoading) && !isMobile && (
        <div>
          <SubdivisionColumn
            title={"Streets"}
            FormComponent={StreetForm}
            childExist={!!streets}
            data={streets}
            setParams={handleStreetClick}
            deleteDialogOpen={deleteDialogOpen}
            setDeleteDialogOpen={setDeleteDialogOpen}
            handleDeleteData={handleDeleteStreet}
            loading={streetsLoading}
            deleteMessage={
              "This action cannot be undone. This will permanently delete your street and all the blocks and lots in this street."
            }
            queryParamsKey="streetId"
          />
        </div>
      )}
      {/* Block Mobile View */}
      {isMobile && (blocks || blocksLoading) && (
        <Sheet
          open={!!blocks}
          onOpenChange={(open) => {
            if (!open) {
              const newParams = new URLSearchParams();
              newParams.delete("phaseId");

              setParams(newParams);
            }
          }}
        >
          <SheetContent className="w-full  sm:max-w-full sm:w-full md:max-w-full ">
            <SubdivisionColumn
              title={"Blocks"}
              FormComponent={BlockForm}
              childExist={!!blocks}
              data={blocks}
              setParams={handleBlockClick}
              deleteDialogOpen={deleteDialogOpen}
              setDeleteDialogOpen={setDeleteDialogOpen}
              handleDeleteData={handleDeleteBlock}
              loading={blocksLoading}
              deleteMessage={
                "This action cannot be undone. This will permanently delete your block and all the lots in this block."
              }
              queryParamsKey="blockId"
            />
          </SheetContent>
        </Sheet>
      )}

      {/* Lots Column */}
      {(lots || lotsLoading) && !isMobile && (
        <SubdivisionColumn
          title={"Lots"}
          FormComponent={LotForm}
          childExist={!!lots}
          data={lots}
          setParams={() => {}}
          deleteDialogOpen={deleteDialogOpen}
          setDeleteDialogOpen={setDeleteDialogOpen}
          handleDeleteData={handleDeleteLot}
          loading={lotsLoading}
          deleteMessage={
            "This action cannot be undone. This will permanently delete your lot."
          }
          queryParamsKey="lotId"
        />
      )}

      {/* Lot Mobile View */}
      {isMobile && (lots || lotsLoading) && (
        <Sheet
          open={!!lots}
          onOpenChange={(open) => {
            if (!open) {
              const newParams = new URLSearchParams();
              newParams.set("phaseId", params.get("phaseId") || "");
              newParams.delete("blockId");
              newParams.delete("streetId");
              setParams(newParams);
            }
          }}
        >
          <SheetContent className="w-full  sm:max-w-full sm:w-full md:max-w-full ">
            <SubdivisionColumn
              title={"Lots"}
              FormComponent={LotForm}
              childExist={!!lots}
              data={lots}
              setParams={() => {}}
              deleteDialogOpen={deleteDialogOpen}
              setDeleteDialogOpen={setDeleteDialogOpen}
              handleDeleteData={handleDeleteLot}
              loading={lotsLoading}
              deleteMessage={
                "This action cannot be undone. This will permanently delete your lot."
              }
              queryParamsKey="lotId"
            />
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};

export default SubdivisionManagement;
