import { axiosDelete, axiosGet, axiosPost, axiosPut } from "@/lib/axios";
import { PaginatedDataType } from "@/types/paginatedType";
import { CommentParamsType, CommentType } from "@/types/commentTypes";

// Fetch comments for a specific announcement with pagination
const fetchComments = async ({
  announcementId,
  page,
  pageSize,
}: {
  announcementId: string;
  page: string;
  pageSize: string;
}): Promise<PaginatedDataType<CommentType>> => {
  return await axiosGet(`/comments/${announcementId}`, {
    params: { page, pageSize },
  });
};

// Add a new comment
const addComment = async (data: CommentParamsType) => {
  return await axiosPost("/comments/add", data);
};

// Delete a comment by its ID
const deleteComment = async (commentId: string) => {
  return await axiosDelete(`/comments/delete/${commentId}`);
};

// Update an existing comment by its ID
const updateComment = async ({
  comment_id,
  comment,
}: {
  comment_id: string;
  comment: string;
}) => {
  return await axiosPut(`/comments/update/${comment_id}`, { comment });
};

// Add a reply to a specific comment
const addReply = async ({
  comment_id,
  data,
}: {
  comment_id: string;
  data: CommentParamsType;
}) => {
  return await axiosPost(`/comments/replies/${comment_id}`, data);
};

// Fetch nested replies for a specific comment
const fetchNestedReplies = async ({
  commentId,
  page,
  pageSize,
}: {
  commentId: string;
  page: string;
  pageSize: string;
}): Promise<PaginatedDataType<CommentType>> => {
  return await axiosGet(`/comments/replies/${commentId}`, {
    params: { page, pageSize },
  });
};

// Delete a reply by its ID
const deleteReply = async (replyId: string) => {
  return await axiosDelete(`/comments/replies/delete/${replyId}`);
};

// Like a specific comment
const likeComment = async ({
  id,
  user_id,
  idType,
}: {
  id?: string;
  user_id?: string;
  idType: string;
}) => {
  return await axiosPost(`/comments/like/${id}`, { user_id, idType });
};

// Dislike a specific comment
const dislikeComment = async (commentId: string) => {
  return await axiosPost(`/comments/dislike/${commentId}`);
};

// Get the like/dislike status for a specific comment by a user
const getCommentStatus = async ({
  comment_id,
  user_id,
  announcement_id,
}: {
  comment_id?: string;
  user_id?: string;
  announcement_id?: string;
}): Promise<{ isLiked: boolean; isDisLiked: boolean }> => {
  return await axiosGet(`/comments/like/status`, {
    params: { user_id, comment_id, announcement_id },
  });
};

// Get the like count for a specific comment
const getLikeCount = async ({
  announcement_id,
  comment_id,
}: {
  comment_id?: string;
  announcement_id?: string;
}): Promise<number> => {
  return await axiosGet(`/comments/like/count`, {
    params: {
      comment_id,
      announcement_id,
    },
  });
};

// Get the dislike count for a specific comment
const getDislikeCount = async (commentId: string) => {
  return await axiosGet(`/comments/dislike-count/${commentId}`);
};

export {
  fetchComments,
  addComment,
  deleteComment,
  updateComment,
  addReply,
  fetchNestedReplies,
  deleteReply,
  likeComment,
  dislikeComment,
  getCommentStatus,
  getLikeCount,
  getDislikeCount,
};
