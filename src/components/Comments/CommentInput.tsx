import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import useUserContext from "@/hooks/useUserContext";
import { CommentFormValues, CommentInputProps } from "@/types/commentTypes";

const CommentInput = ({
  announcement_id,
  handleAddComment,
}: CommentInputProps) => {
  const { register, handleSubmit, reset } = useForm<CommentFormValues>();
  const { user } = useUserContext();
  const [isCommenting, setIsCommenting] = useState(false);

  return (
    <div className="mt-2 flex-grow">
      <form
        onSubmit={handleSubmit((data) => {
          handleAddComment({
            comment: data.comment,
            userId: user?.id,
            announcementId: announcement_id,
          });
          reset(), setIsCommenting(false);
        })}
        id={`comment${announcement_id}`}
        className="flex-1"
      >
        <Textarea
          className="rounded-2xl h-9 max-h-9  bg-default focus:border-none resize-none focus:outline-none"
          {...register("comment", { required: true })} // Use the correct field name
          onFocus={() => setIsCommenting(true)}
          placeholder="Write a comment..."
        />
      </form>

      {isCommenting && (
        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            className="rounded-xl"
            onClick={() => {
              reset(), setIsCommenting(false);
            }}
            variant={"outline"}
          >
            Cancel
          </Button>
          <Button
            className="rounded-xl"
            type="submit"
            form={`comment${announcement_id}`}
          >
            Comment
          </Button>
        </div>
      )}
    </div>
  );
};

export default CommentInput;
