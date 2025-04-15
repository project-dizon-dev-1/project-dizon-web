import { Database } from "./database";

type totalDue = {
  total_due: number;
};

type Due = Database["public"]["Tables"]["dues-list"]["Row"];

type EditDue = {
  dueId: string;
  dueCost: number;
  dueDescription?: string | null;
  dueName: string;
};

type DueLog = {
  id: string;
  status: string | null;
  created_at: Date;
  date: Date | null;
  details: string | null;
  amount: number | null;
  proof_url: string | null;
  receiver: {
    user_first_name: string;
    user_last_name: string;
  } | null;
  confirmed_by_user: {
    user_first_name: string;
    user_last_name: string;
  } | null;
  house_list: {
    house_family_name: string;
    phases: {
      name: string;
    };
    blocks: {
      name: string;
    };
    streets: {
      name: string;
    };
    lots: {
      name: string;
    };
  } | null;
  amount_status: "Partially_Paid" | "Fully_Paid" | null;
};

type DueCategoryType = ({
  dues_list: {
    id: string;
    due_name: string;
    due_description: string | null;
    due_cost: number;
    due_is_active: boolean;
    latest_paid_month: Date | null;
  }[];
} & {
  created_at: Date;
  name: string;
  id: string;
  total_expenses: number;
})[];
export type { totalDue, Due, EditDue, DueLog, DueCategoryType };
