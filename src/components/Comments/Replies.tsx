import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import CommentDate from "./CommentDate";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "../ui/dialog";
import ReplyInput from "./ReplyInput";
import { cn, getInitial } from "@/lib/utils";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import EditReplyForm from "./EditReplyForm";
import { useState } from "react";
import { RepliesPropTypes } from "@/types/commentTypes";
import TriggerLikeIcon from "./TriggerLike";
import useUserContext from "@/hooks/useUserContext";
import { Icon } from "@iconify/react/dist/iconify.js";
import AutoLinkText from "@/lib/AutoLinkText";

const Replies = ({
  reply,
  // showReply,
  commentId,
  announcement_id,
  handleUpdateReply,
  handleDeleteReply,
}: RepliesPropTypes) => {
  const { user } = useUserContext();
  const [isReplying, setIsReplying] = useState(false);
  const [isEditting, setEditting] = useState(false);

  return (
    <div key={reply.id} className={cn("mb-4 flex flex-col gap-2  text-xs ")}>
      <div className="flex items-start gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={""} alt="profile picture" />
          <AvatarFallback className="bg-blue-100">
            {getInitial(reply?.users_list?.user_first_name)}
          </AvatarFallback>
        </Avatar>

        {isEditting ? (
          <EditReplyForm
            comment_id={reply.id}
            setEditting={setEditting}
            InputDefaultValue={reply.comment}
            handleUpdateReply={handleUpdateReply}
          />
        ) : (
          <div className="relative flex-grow rounded-3xl bg-default px-5 py-4">
            <div className="flex flex-grow justify-between">
              <div className="flex flex-col">
                <p className="font-bold">{`${reply?.users_list?.user_first_name} ${reply?.users_list?.user_last_name}`}</p>
                <div className="flex gap-1">
                  <CommentDate
                    date={reply.created_at}
                    isEdited={reply.is_edited}
                  />
                </div>
              </div>
              <div>
                {user?.id === reply?.users_list?.id && (
                  <Popover>
                    <PopoverTrigger>
                      {/* <img src={kebab} alt="kebab icon" /> */}
                      <Icon icon="mingcute:more-1-line" className="h-5 w-5" />
                    </PopoverTrigger>
                    <PopoverContent
                      align="center"
                      className=" w-fit overflow-hidden p-0 outline-none"
                    >
                      <Button
                        onClick={() => setEditting(true)}
                        className="w-full p-3 text-center  hover:cursor-pointer"
                        variant={"ghost"}
                      >
                        Edit
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className="w-full rounded-none text-center hover:cursor-pointer"
                            variant={"ghost"}
                          >
                            Delete
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] sm:rounded-3xl">
                          <DialogHeader>
                            <DialogTitle>Delete Comment</DialogTitle>
                            <DialogDescription>
                              Delete Your Comment Permanently
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button
                                type="button"
                                variant="outline"
                                className=" rounded-xl"
                              >
                                Cancel
                              </Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button
                                onClick={() => handleDeleteReply(reply.id)}
                                variant={"destructive"}
                                type="submit"
                                className=" rounded-xl"
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
            <div>
              <AutoLinkText
                className="block whitespace-pre-wrap break-all text-start leading-5 "
                text={reply.comment}
              />
              <div className="flex items-center">
                {/* <TriggerDislikeIcon
                  className="absolute -bottom-4 right-2 w-14 rounded-3xl bg-white p-1"
                  comment_id={reply.id}
                  user_id={userData?.id}
                  columnName="comment_id"
                /> */}
                <TriggerLikeIcon
                  className="absolute z-50"
                  comment_id={reply.id}
                  user_id={user?.id}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      {isReplying && (
        <ReplyInput
          replyTo={`${reply.users_list?.user_first_name} ${reply.users_list?.user_last_name}`}
          comment_id={commentId}
          announcement_id={announcement_id}
          setIsReplying={setIsReplying}
        />
      )}
    </div>
  );
};

export default Replies;
