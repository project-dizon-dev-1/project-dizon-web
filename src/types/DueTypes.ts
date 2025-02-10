import { Database } from "./database";

type totalDue = {
  total_due: number;
};

type Due = Database["public"]["Tables"]["dues-list"]["Row"];

type EditDue = Omit<Due, "created_at" | "updated_at"> | null;

export type { totalDue, Due,EditDue };
