import useLikeDislike from "@/hooks/useLikeDislike";

import { cn } from "@/lib/utils";
import { LikeDislikeParams } from "@/types/announcementTypes";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

const TriggerLike = ({
  className,
  comment_id,
  announcement_id,
  user_id,
}: LikeDislikeParams) => {
  const { addLikeMutation, likeCount, commentStatus } = useLikeDislike({
    comment_id,
    user_id,
    announcement_id,
  });
  // console.log(commentStatus);
  return (
    <Button
      className={cn(
        "w-12  right-8 -bottom-3 h-7 rounded-full bg-white hover:bg-white",
        {
          "bg-[#2394FE] hover:bg-[#2394FE] outline-4 outline-offset-2 outline-solid outline-white":
            commentStatus?.isLiked === true,
        },
        className
      )}
      disabled={addLikeMutation?.isPending}
      onClick={() =>
        addLikeMutation.mutate({
          id: announcement_id ? announcement_id : comment_id,
          user_id,
          idType: comment_id ? "comment_id" : "announcement_id",
        })
      }
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-3xl ",
          { "bg-[#2394FE]": commentStatus?.isLiked }
        )}
      >
        <Icon
          icon={"mingcute:thumb-up-fill"}
          className={cn("h-4 w-4 text-default opacity-70", {
            "text-white opacity-100": commentStatus?.isLiked,
          })}
        />
        {likeCount.isLoading ? (
          <Skeleton className="w-3 h-4" />
        ) : (
          <p
            className={cn("text-sm text-default opacity-70", {
              "text-white opacity-100": commentStatus?.isLiked,
            })}
          >
            {likeCount.data}
          </p>
        )}{" "}
      </div>
    </Button>
  );
};

export default TriggerLike;
