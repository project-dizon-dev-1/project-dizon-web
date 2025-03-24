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
    comment_enabled:boolean;
  };
};

type AnnouncementHeaderProps = {
  image?: string;
  first_name?: string;
};

type LikeDislikeParams = {
  comment_id?: string;
  user_id?: string;
  className?: string;
  announcement_id?: string;
};

type paginatedAnnouncementQueryParams = {
  page: string;
  pageSize: string;
  phase: string | null;
};
export type {
  Announcement,
  paginatedAnnouncementQueryParams,
  AnnouncementHeaderProps,
  LikeDislikeParams,
};
