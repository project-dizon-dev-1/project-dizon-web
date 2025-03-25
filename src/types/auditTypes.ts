type AuditType = {
  id: string;
  created_at: Date;
  users_list: {
    user_first_name: string;
    user_last_name: string;
  };
  description: string;
};

export type { AuditType };
