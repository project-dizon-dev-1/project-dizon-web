import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "./use-toast";
import {
  getCommentStatus,
  getLikeCount,
  likeComment,
} from "@/services/commentServices";

const useLikeDislike = ({
  comment_id,
  user_id,
  announcement_id,
}: {
  comment_id?: string;
  user_id?: string;
  announcement_id?: string;
}) => {
  const queryClient = useQueryClient();

  const addLikeMutation = useMutation({
    mutationFn: likeComment,
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["likeCount", comment_id, announcement_id],
      });
      await queryClient.cancelQueries({
        queryKey: ["dislikeCount", comment_id, announcement_id],
      });
      await queryClient.cancelQueries({
        queryKey: ["commentStatus", comment_id, user_id, announcement_id],
      });
      const previousLikeCount = queryClient.getQueryData([
        "likeCount",
        comment_id,
        announcement_id,
      ]);
      const previousDislikeCount = queryClient.getQueryData([
        "dislikeCount",
        comment_id,
        announcement_id,
      ]);
      const previousCommentStatus = queryClient.getQueryData([
        "commentStatus",
        comment_id,
        user_id,
        announcement_id,
      ]);
      let isLiked: boolean = false;

      queryClient.setQueryData(
        ["commentStatus", comment_id, user_id, announcement_id],
        (old: { isLiked: boolean; isDisliked: boolean }) => {
          isLiked = !old.isLiked;
          return {
            ...old,
            isLiked: !old.isLiked,
            isDisliked: false,
          };
        }
      );
      queryClient.setQueryData(
        ["likeCount", comment_id, announcement_id],
        (old: number) => {
          if (isLiked) {
            return old + 1;
          } else {
            return old - 1;
          }
        }
      );
      queryClient.setQueryData(
        ["dislikeCount", comment_id, announcement_id],
        (old: number) => old - 1
      );

      return {
        previousLikeCount,
        previousDislikeCount,
        previousCommentStatus,
      };
    },
    onError: (error, _newTodo, context) => {
      toast({
        title: "Something went wrong",
        description: `${error.message}`,
      });
      queryClient.setQueryData(
        ["likeCount", comment_id, announcement_id],
        context?.previousLikeCount
      );
      queryClient.setQueryData(
        ["dislikeCount", comment_id, announcement_id],
        context?.previousDislikeCount
      );
      queryClient.setQueryData(
        ["commentStatus", comment_id, user_id, announcement_id],
        context?.previousCommentStatus
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["likeCount", comment_id, announcement_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["dislikeCount", comment_id, announcement_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["commentStatus", comment_id, user_id, announcement_id],
      });
    },
  });

  const addDislikeMutation = useMutation({
    // mutationFn: dislikeComment,
    onError: (error) => {
      console.error("Mutation error:", error);
      toast({
        title: "Something went wrong",
        description: `${error.message}`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["dislikeCount", comment_id, announcement_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["likeCount", comment_id, announcement_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["commentStatus", comment_id, user_id, announcement_id],
      });
    },
  });

  const { data: commentStatus } = useQuery({
    queryKey: ["commentStatus", comment_id, user_id, announcement_id],
    queryFn: () => getCommentStatus({ comment_id, user_id, announcement_id }),
    enabled: (!!user_id && !!comment_id) || !!announcement_id,
  });

  const likeCount = useQuery({
    queryKey: ["likeCount", comment_id, announcement_id],
    queryFn: () => getLikeCount({ comment_id, announcement_id }),
    enabled: !!comment_id || !!announcement_id,
  });

  const { data: dislikeCount } = useQuery({
    queryKey: ["dislikeCount", comment_id],
    // queryFn: () => getDislikeCount({ comment_id, columnName }),
    enabled: !!comment_id,
  });

  return {
    addLikeMutation,
    addDislikeMutation,
    commentStatus,
    dislikeCount,
    likeCount,
  };
};
export default useLikeDislike;
