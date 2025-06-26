type Users = {
  id: string;
  user_first_name: string;
  user_last_name: string;
  user_email: string;
  role: "admin" | "user" | "superadmin";
};

export type { Users };
