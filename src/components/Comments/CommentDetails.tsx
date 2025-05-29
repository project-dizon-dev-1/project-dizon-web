import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { cn, getInitial } from "@/lib/utils";
import CommentDate from "./CommentDate";
import ReplyInput from "./ReplyInput";
import EditCommentForm from "./EditCommentForm";
import useReply from "@/hooks/useReply";
import useComment from "@/hooks/useComment";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Replies from "./Replies";
import { Icon } from "@iconify/react";
import useUserContext from "@/hooks/useUserContext";
import { CommentDetailsPropTypes } from "@/types/commentTypes";
import TriggerLike from "./TriggerLike";
import { Skeleton } from "../ui/skeleton";
import AutoLinkText from "@/lib/AutoLinkText";

const CommentDetails = ({
  announcement_id,
  comment,
}: CommentDetailsPropTypes) => {
  const { user } = useUserContext();
  const [isReplying, setIsReplying] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [isEditting, setEditting] = useState(false);
  const { handleDeleteComment, handleUpdateComment } = useComment({
    announcement_id,
    comment_id: comment.id,
  });
  const { replies, handleUpdateReply, handleDeleteReply } = useReply(
    comment.id,
    announcement_id,
    showReply
  );

  return (
    <div className="mb-4 flex items-start gap-2">
      <div className="flex">
        <Avatar className="h-8 w-8 bg-blue-100">
          <AvatarImage src={""} alt="profile picture" />
          <AvatarFallback className="h-8 w-8 rounded-full bg-blue-100 p-2 ">
            {getInitial(comment.users_list.user_first_name)}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex-grow">
        {!isEditting ? (
          <div className="relative flex flex-col justify-between rounded-3xl bg-default px-5 pb-5 pt-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm font-bold opacity-80">{`${comment.users_list.user_first_name} ${comment.users_list.user_last_name}`}</p>
                <CommentDate
                  date={comment.created_at}
                  isEdited={comment.is_edited}
                />
              </div>
              <div>
                {user?.id === comment.users_list.id && (
                  <Popover>
                    <PopoverTrigger>
                      <Icon icon="mingcute:more-1-line" className="h-5 w-5 " />
                    </PopoverTrigger>
                    <PopoverContent className="flex w-28 flex-col overflow-hidden p-0">
                      <Button
                        onClick={() => setEditting(true)}
                        className="w-full rounded-none"
                        variant={"ghost"}
                      >
                        Edit
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className="w-full rounded-none"
                            variant={"ghost"}
                          >
                            Delete
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] sm:rounded-3xl">
                          <DialogHeader>
                            <DialogTitle className="font-bold ">
                              Delete Comment
                            </DialogTitle>
                            <DialogDescription className=" opacity-80">
                              Delete Your Comment Permanently
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button
                                className="rounded-xl text-default"
                                type="button"
                                variant="outline"
                              >
                                Cancel
                              </Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button
                                className="rounded-xl"
                                onClick={() => handleDeleteComment(comment.id)}
                                variant={"destructive"}
                                type="submit"
                              >
                                Delete
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </PopoverContent>
                  </Popover>
                )}
                <button
                  onClick={() => setIsReplying(true)}
                  className="ml-2 rounded-2xl"
                >
                  <Icon
                    icon="mingcute:back-2-line"
                    className="h-5 w-5 text-default hover:cursor-pointer"
                  />
                </button>
              </div>
            </div>
            <AutoLinkText
              className="block whitespace-pre-wrap break-words text-start leading-5 "
              text={comment.comment}
            />

            <div className="flex items-center">
              <TriggerLike
                className="absolute"
                comment_id={comment.id}
                user_id={user?.id}
              />
            </div>
          </div>
        ) : (
          <EditCommentForm
            comment_id={comment.id}
            setEditting={setEditting}
            InputDefaultValue={comment.comment}
            handleUpdateComment={handleUpdateComment}
          />
        )}
        {isReplying && (
          <ReplyInput
            comment_id={comment.id}
            announcement_id={announcement_id}
            setIsReplying={setIsReplying}
            replyTo={`${comment.users_list.user_first_name} ${comment.users_list.user_last_name}`}
          />
        )}

        {comment?.reply_count > 0 && (
          <button
            type="button"
            onClick={() => setShowReply((prevState) => !prevState)}
            className=" px-1  rounded-2xl text-sm w-fit hover:underline mb-1"
          >
            {showReply
              ? "Hide Replies"
              : `Show Replies (${comment?.reply_count})`}
          </button>
        )}
        <div
          className={cn(
            "flex overflow-hidden transition-all duration-500 flex-col",
            {
              "max-h-[1000px] opacity-100": showReply === true,
              "max-h-0 opacity-0": showReply === false,
            }
          )}
        >
          {replies.isLoading
            ? Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="w-full mb-2">
                  <div className=" flex gap-2">
                    <Skeleton className=" rounded-full h-8 w-8" />
                    <Skeleton className=" rounded-[15px] h-20 w-full" />
                  </div>
                </div>
              ))
            : replies.data?.pages.flatMap((page, pageIndex) =>
                page.items.map((reply, replyIndex) => (
                  <Replies
                    key={`${pageIndex}-${replyIndex}`}
                    commentId={comment.id}
                    // showReply={showReply}
                    announcement_id={announcement_id}
                    reply={reply}
                    handleDeleteReply={handleDeleteReply}
                    handleUpdateReply={handleUpdateReply}
                  />
                ))
              )}
        </div>
      </div>
    </div>
  );
};

export default CommentDetails;
