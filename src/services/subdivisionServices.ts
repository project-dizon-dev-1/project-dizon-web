import { axiosGet, axiosPut, axiosPost, axiosDelete } from "@/lib/axios";
import {
  MonthlyTransactionData,
  SubdivisionPhases,
  TransactionSummary,
} from "@/types/HouseTypes";
import { fixedDueType } from "@/types/subdivisionTypes";
import { configureCollectionSchemaType } from "@/validations/collectionSchema";

const fetchSubdivisionPhases = async (): Promise<SubdivisionPhases> => {
  return await axiosGet("/subdivision/phases");
};
const fetchSubdivisionSummary = async (): Promise<TransactionSummary> => {
  return await axiosGet("/subdivision/summary");
};
const fetchSubdivisionDashboard = async (): Promise<
  MonthlyTransactionData[]
> => {
  return await axiosGet("/subdivision/dashboard");
};
const fetchFixedDue = async (): Promise<fixedDueType | null> => {
  return await axiosGet("/subdivision/collection/fixed-due");
};

const upsertFixedDue = async (data: configureCollectionSchemaType) => {
  return await axiosPut("/subdivision/collection/upsert", data);
};

const addPhase = async (data: { name: string }) => {
  return await axiosPost("/subdivision/phases", data);
};

const addBlock = async (data: { name: string; phaseId: string }) => {
  return await axiosPost("/subdivision/blocks", data);
};

const addStreet = async (data: { name: string; phaseId: string }) => {
  return await axiosPost("/subdivision/streets", data);
};

const addLot = async (data: { name: string; blockId: string }) => {
  return await axiosPost("/subdivision/lots", data);
};
const editLot = async ({
  lotId,
  data,
}: {
  lotId?: string;
  data: { name: string };
}) => {
  return await axiosPut(`/subdivision/lots/${lotId}/edit`, data);
};

const editPhase = async ({
  phaseId,
  data,
}: {
  phaseId?: string;
  data: { name: string };
}) => {
  return await axiosPut(`/subdivision/phases/${phaseId}/edit`, data);
};

const editBlock = async ({
  blockId,
  data,
}: {
  blockId?: string;
  phaseId?: string;
  data: { name: string; phaseId: string };
}) => {
  return await axiosPut(`/subdivision/blocks/${blockId}/edit`, data);
};

const editStreet = async ({
  streetId,
  data,
}: {
  streetId?: string;
  phaseId?: string;
  data: { name: string; phaseId: string };
}) => {
  return await axiosPut(`/subdivision/streets/${streetId}/edit`, data);
};

const fetchAllPhases = async (): Promise<
  {
    id: string;
    name: string;
  }[]
> => {
  return await axiosGet("/subdivision/phases/all");
};

// const fetchAllBlocks = async (): Promise<
//   {
//     created_at: Date;
//     name: string;
//     id: string;
//     phase_id: string;
//   }[]
// > => {
//   return await axiosGet("/subdivision/blocks/all");
// };

// const fetchAllStreets = async (): Promise<
//   {
//     id: string;
//     created_at: Date;
//     name: string;
//     phase_id: string;
//   }[]
// > => {
//   return await axiosGet("/subdivision/streets/all");
// };

// const fetchAllLots = async (): Promise<
//   {
//     name: string;
//     id: string;
//     created_at: Date;
//     block_id: string;
//   }[]
// > => {
//   return await axiosGet("/subdivision/lots/all");
// };

const fetchBlocksByPhase = async (
  phaseId?: string | null
): Promise<
  {
    id: string;
    name: string;
  }[]
> => {
  return await axiosGet(`/subdivision/phases/${phaseId}/blocks`);
};

const fetchStreetsByPhase = async (
  phaseId?: string | null
): Promise<
  {
    id: string;
    name: string;
  }[]
> => {
  return await axiosGet(`/subdivision/phases/${phaseId}/streets`);
};

const deletePhase = async (phaseId: string) => {
  return await axiosDelete(`/subdivision/phases/${phaseId}/delete`);
};
const deleteBlock = async (blockId: string) => {
  return await axiosDelete(`/subdivision/blocks/${blockId}/delete`);
};
const deleteStreet = async (streetId: string) => {
  return await axiosDelete(`/subdivision/streets/${streetId}/delete`);
};
const deleteLot = async (lotId: string) => {
  return await axiosDelete(`/subdivision/lots/${lotId}/delete`);
};

const fetchLotsByBlock = async (
  blockId?: string | null
): Promise<
  {
    name: string;
    id: string;
  }[]
> => {
  return await axiosGet(`/subdivision/blocks/${blockId}/lots`);
};

const fetchPaymentStatus = async (): Promise<{
  message: string;
  status: string;
}> => {
  return await axiosGet(`/subdivision/payment-status`);
};
const sendEmailInquiry = async (data: {
  message: string;
  subject: string;
  email: string;
  name: string;
}): Promise<{
  message: string;
} | null> => {
  return await axiosPost(`/subdivision/send-inquiry`, data);
};

export {
  fetchSubdivisionPhases,
  fetchSubdivisionSummary,
  fetchSubdivisionDashboard,
  upsertFixedDue,
  fetchFixedDue,
  addPhase,
  sendEmailInquiry,
  addBlock,
  addStreet,
  addLot,
  fetchAllPhases,
  // fetchAllBlocks,
  // fetchAllStreets,
  // fetchAllLots,
  fetchBlocksByPhase,
  fetchStreetsByPhase,
  fetchLotsByBlock,
  editPhase,
  editBlock,
  editStreet,
  editLot,
  deletePhase,
  deleteBlock,
  deleteStreet,
  deleteLot,
  fetchPaymentStatus,
};
