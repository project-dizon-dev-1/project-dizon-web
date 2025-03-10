import { getInitial } from "@/lib/utils";
import CommentInput from "./CommentInput";
import useComment from "@/hooks/useComment";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CommentDetails from "@/components/Comments/CommentDetails";
import useInterObserver from "@/hooks/useIntersectObserver";
import useUserContext from "@/hooks/useUserContext";
import { Skeleton } from "../ui/skeleton";

const Comments = ({ announcement_id }: { announcement_id: string }) => {
  const { user } = useUserContext();
  const Initial = getInitial(user?.user_first_name);
  const {
    handleAddComment,
    commentData,
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = useComment({ announcement_id });

  const { ref } = useInterObserver(fetchNextPage);

  return (
    <div className="">
      <h1 className="text-md mb-2 font-bold text-accent">
        {commentData?.pages[0]?.totalItems} Comments
      </h1>
      <div className="no-scrollbar max-h-52 overflow-y-scroll">
        {!isLoading ? (
          <div>
            {commentData?.pages.flatMap((page) =>
              page.items.map((comment) => (
                <CommentDetails
                  key={comment.id}
                  comment={comment}
                  announcement_id={announcement_id}
                />
              ))
            )}
            {hasNextPage && <div className="h-2" ref={ref}></div>}
          </div>
        ) : (
          Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="w-full mb-2">
              <div className=" flex gap-2">
                <Skeleton className=" rounded-full h-8 w-8" />
                <Skeleton className=" rounded-[15px] h-20 w-full" />
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex w-full items-start justify-center gap-3">
        <Avatar className="h-8 w-8 bg-blue-100">
          <AvatarImage src={""} alt="profile picture" />
          <AvatarFallback className="h-8 w-8 rounded-full bg-blue-100 p-2 text-black">
            {Initial}
          </AvatarFallback>
        </Avatar>

        <CommentInput
          handleAddComment={handleAddComment}
          announcement_id={announcement_id}
        />
      </div>
    </div>
  );
};

export default Comments;
