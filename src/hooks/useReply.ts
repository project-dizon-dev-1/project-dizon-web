import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useToast } from "./use-toast";
import {
  addReply,
  deleteReply,
  fetchNestedReplies,
  updateComment,
} from "@/services/commentServices";
import { CommentParamsType } from "@/types/commentTypes";

const useReply = (
  commentId: string,
  announcement_id?: string,
  showReply: boolean = false
) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addReplyMutation = useMutation({
    mutationFn: addReply,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Reply Added.",
      });
    },
    onError: (error) => {
      // console.error("Mutation error:", error);
      toast({
        title: "Something went wrong",
        description: `${error.message}`,
      });
    },
    onSettled: () => {
      // console.log("revalidaing", announcement_id);
      queryClient.invalidateQueries({ queryKey: ["replies", commentId] });
      queryClient.invalidateQueries({
        queryKey: ["comments", announcement_id],
      });
    },
  });
  const deleteReplyMutation = useMutation({
    mutationFn: deleteReply,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Reply Deleted.",
      });
    },
    onError: (error) => {
      // console.error("Mutation error:", error);
      toast({
        title: "Something went wrong",
        description: `${error.message}`,
      });
    },
    onSettled: () => {
      // console.log("revalidaing", announcement_id);
      queryClient.invalidateQueries({ queryKey: ["replies", commentId] });
      queryClient.invalidateQueries({
        queryKey: ["comments", announcement_id],
      });
    },
  });
  const updateReplyMutation = useMutation({
    mutationFn: updateComment,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Comment Updated.",
      });

      //   reset()
    },
    onError: (error) => {
      // console.error("Mutation error:", error);
      toast({
        title: "Something went wrong",
        description: `${error.message}`,
      });
    },
    onSettled: () => {
      // console.log("before invalidating", commentId);
      queryClient.invalidateQueries({
        queryKey: ["replies", commentId],
      });

      // const cached = queryClient.getQueryCache();
      // const keys = cached
      //   .getAll()
      //   .map((query) => ({ key: query.queryKey, value: query.state.data }));
      // console.log(keys);
    },
  });

  const handleAddReply = (comment_id: string, data: CommentParamsType) => {
    addReplyMutation.mutate({
      comment_id,
      data,
    });
  };
  const handleDeleteReply = (comment_id: string) => {
    deleteReplyMutation.mutate(comment_id);
  };

  const handleUpdateReply = (data: { comment: string; comment_id: string }) => {
    // console.log("comment_ID",inputs,comment_id)
    updateReplyMutation.mutate(data);
  };

  //   const { data, isLoading, isError } = useQuery({
  //     queryKey: ["replies", commentId],
  //     queryFn: async () => await fetchNestedReplies(commentId),
  //     enabled: showReply,
  //     onError: (error) => {
  //       console.error("Error fetching data:", error);
  //     },
  //   });
  const replies = useInfiniteQuery({
    queryKey: ["replies", commentId],
    queryFn: async ({ pageParam }) => {
      const response = await fetchNestedReplies({
        page: pageParam.toString(),
        pageSize: "10",
        commentId: commentId ?? "",
      });
      return response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.nextPage) {
        return lastPage.currentPage + 1;
      }
    },

    enabled: showReply && !!commentId,
  });

  return {
    handleAddReply,
    handleDeleteReply,
    handleUpdateReply,
    replies,
  };
};
export default useReply;
