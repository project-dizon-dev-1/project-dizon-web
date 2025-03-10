import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  addComment,
  deleteComment,
  fetchComments,
  updateComment,
} from "@/services/commentServices";
import { toast } from "./use-toast";
import { CommentParamsType } from "@/types/commentTypes";

const useComment = ({
  announcement_id,
  comment_id,
}: {
  announcement_id?: string;
  comment_id?: string;
}) => {
  const queryClient = useQueryClient();

  const addCommentMutation = useMutation({
    mutationFn: addComment,
    onSuccess: () => {
      // toast({
      //   title: "Success",
      //   description: "Comment Added.",
      // });
    },
    onError: (error) => {
      toast({
        title: "Something went wrong",
        description: `${error.message}`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", announcement_id],
      });
    },
  });
  const {
    data: commentData,
    isError,
    hasNextPage,
    fetchNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["comments", announcement_id],
    queryFn: async ({ pageParam }) => {
      const response = await fetchComments({
        page: pageParam.toString(),
        pageSize: "10",
        announcementId: announcement_id as string,
      });
      return response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.nextPage) {
        return lastPage.currentPage + 1;
      }
    },

    enabled: !!announcement_id,
  });

  const deleteCommentMutation = useMutation({
    mutationFn: deleteComment,
    // onSuccess: () => {
    //   toast({
    //     title: "Success",
    //     description: "Comment Deleted.",
    //   });
    // },
    onError: (error) => {
      toast({
        title: "Something went wrong",
        description: `${error.message}`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", announcement_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["replies", comment_id],
      });
    },
  });
  const updateCommentMutation = useMutation({
    mutationFn: updateComment,
    onError: (error) => {
      toast({
        title: "Something went wrong",
        description: `${error.message}`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", announcement_id],
      });
    },
  });

  const handleAddComment = ({
    comment,
    userId,
    announcementId,
  }: // setIsCommenting,
  // reset,
  CommentParamsType) => {
    addCommentMutation.mutate({
      comment,
      userId,
      announcementId,
      // setIsCommenting,
      // reset,
    });
  };

  const handleDeleteComment = (comment_id: string) => {
    deleteCommentMutation.mutate(comment_id);
  };

  const handleUpdateComment = ({
    comment,
    comment_id,
  }: {
    comment: string;
    comment_id: string;
  }) => {
    updateCommentMutation.mutate(
      { comment, comment_id },
      {
        onSuccess: () => {
          // setEditting(false);
        },
      }
    );
  };

  return {
    handleDeleteComment,
    handleUpdateComment,
    handleAddComment,
    isError,
    isLoading,
    commentData,
    hasNextPage,
    fetchNextPage,
  };
};

export default useComment;
