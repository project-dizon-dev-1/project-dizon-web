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
    onError: (error) => {
      toast({
        title: "Something went wrong",
        description: `${error.message}`,
      });
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
