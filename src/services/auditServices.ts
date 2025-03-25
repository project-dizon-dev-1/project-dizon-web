import { axiosGet } from "@/lib/axios";
import { AuditType } from "@/types/auditTypes";
import { PaginatedDataType } from "@/types/paginatedType";

const fetchAudits = async (
  page: string,
  pageSize: string
): Promise<PaginatedDataType<AuditType>> => {
  return await axiosGet(`/audit/`, {
    params: { page, pageSize },
  });
};

export { fetchAudits };
