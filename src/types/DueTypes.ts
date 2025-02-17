import { Database } from "./database";

type totalDue = {
  total_due: number;
};

type Due = Database["public"]["Tables"]["dues-list"]["Row"];

type EditDue = Omit<Due, "created_at" | "updated_at"> | null;

type DueLog = {
  id: string;
  status: string | null;
  created_at: Date;
  date: Date | null;
  details: string | null;
  amount: number | null;
  confirmed_by: string | null;
  house_list: {
    house_family_name: string;
    house_phase: string;
    house_block: string;
    house_street: string;
    house_lot: string;

  } | null;
};

type FetchHouseCollectionQueryParams = {
  page:string
  query?: string
  phase?:string
  street?:string
  block?:string
  lot?:string
}

export type { totalDue, Due, EditDue, DueLog,FetchHouseCollectionQueryParams };
