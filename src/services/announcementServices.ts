import { axiosDelete, axiosGet, axiosPost, axiosPut } from "@/lib/axios";
import { Announcement, paginatedAnnouncementQueryParams } from "@/types/announcementTypes";
import { PaginatedDataType } from "@/types/paginatedType";

const addAnnouncement = async ({
  userId,
  data,
}: {
  userId: string | undefined;
  data: FormData;
}) => {
  return await axiosPost(`/announcements/add/${userId}`, data);
};

const fetchAnnouncements = async ({
  page,
  pageSize,
  phase
}:paginatedAnnouncementQueryParams): Promise<PaginatedDataType<Announcement>> => {
  return await axiosGet(`/announcements/`, {
    params: { page, pageSize,phase },
  });
};

const fetchAnnouncementPhases = async (announcemendId:string|undefined):Promise<number[]> => {
    return await axiosGet(`/announcements/announcementPhases/${announcemendId}`);
};
const toggleComment = async () => {
  return await axiosPost(`/announcements/toggleComment/`);
};

const editAnnouncement = async ({announcementId,data}:{announcementId:string,data:FormData}) => {

    return await axiosPut(`/announcements/put/${announcementId}`,data);

};

const deleteAnnouncements = async (announcementId:string) => {
    return await axiosDelete(`/announcements/delete/${announcementId}`);
};

export { toggleComment,editAnnouncement,addAnnouncement, fetchAnnouncements,deleteAnnouncements,fetchAnnouncementPhases };
