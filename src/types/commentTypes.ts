import React, { Dispatch } from "react";

type CommentParamsType = {
  comment: string; // Updated comment content
  userId?: string; // ID of the user who updated the comment
  announcementId?: string; // ID of the announcement this comment is related to
};

type handleAddComment = ({
  comment,
  userId,
  announcementId,
}: CommentParamsType) => void;

type CommentInputProps = {
  announcement_id: string;
  handleAddComment: handleAddComment;
};

type UserType = {
  id: string; // Unique user ID
  user_first_name: string; // First name of the user
  user_last_name: string; // Last name of the user
};

// Represents a single comment
type CommentType = {
  id: string; // Unique comment ID
  created_at: string; // Date and time the comment was created
  comment: string; // The content of the comment
  user_id: string; // ID of the user who posted the comment
  parent_id: string | null; // ID of the parent comment (null for top-level comments)
  is_edited: boolean; // Whether the comment has been edited
  announcement_id: string; // ID of the announcement this comment is related to
  reply_count: number; // Number of replies to the comment
  users_list: UserType; // The user associated with this comment (user details)
};

type CommentDetailsPropTypes = {
  announcement_id: string;
  comment: CommentType;
};
type CommentFormValues = {
  comment: string;
};

type setShowReplyButtonPropType = {
  replyCount: number;
  setShowReply: Dispatch<React.SetStateAction<boolean>>;
  showReply: boolean;
};

type handleUpdateComment = ({
  comment,
  comment_id,
}: {
  comment: string;
  comment_id: string;
}) => void;

type EditCommentFormPropsType = {
  comment_id: string;
  setEditting: Dispatch<React.SetStateAction<boolean>>;
  InputDefaultValue: string;
  handleUpdateComment: handleUpdateComment;
};

type EditReplyFormPropsType = {
  comment_id: string;
  setEditting: Dispatch<React.SetStateAction<boolean>>;
  InputDefaultValue: string;
  handleUpdateReply: handleUpdateComment;
};
type RepliesPropTypes = {
  reply: CommentType;
  // showReply: boolean;
  commentId: string;
  announcement_id: string;
  handleUpdateReply: handleUpdateComment;
  handleDeleteReply: (comment_id: string) => void;
};

type ReplyInputPropType = {
  comment_id: string;
  setIsReplying: React.Dispatch<React.SetStateAction<boolean>>;
  // setEditting: React.Dispatch<React.SetStateAction<boolean>>;
  replyTo: string | null;
  announcement_id?: string;
  // handleAddReply: handleAddReply;
};

type ReplyFormInputs = {
  reply: string;
};

export type {
  CommentInputProps,
  CommentType,
  CommentParamsType,
  CommentDetailsPropTypes,
  handleAddComment,
  CommentFormValues,
  setShowReplyButtonPropType,
  EditCommentFormPropsType,
  EditReplyFormPropsType,
  RepliesPropTypes,
  ReplyInputPropType,
  ReplyFormInputs,
};
