type Announcement = {
  announcements: {
    users_list: {
      user_last_name: string;
      user_first_name: string;
    } | null;
    announcement_files: {
      url: string;
      name: string;
      type: string;
      announcement_id: string;
    }[];
    id: string;
    created_at: Date;
    title: string;
    content: string;
  };
};

// type AnnouncementProps = {
//     id:string,
//     title:string,
//     create
// }

type paginatedAnnouncementQueryParams = {
  page: string;
  pageSize: string;
  phase: string | null;
};
export type { Announcement, paginatedAnnouncementQueryParams };
