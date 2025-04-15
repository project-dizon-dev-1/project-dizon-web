import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { EditCommentFormPropsType } from "@/types/commentTypes";

const EditCommentForm = ({
  comment_id,
  setEditting,
  InputDefaultValue,
  handleUpdateComment,
}: EditCommentFormPropsType) => {
  const { register, handleSubmit } = useForm({
    defaultValues: { comment: InputDefaultValue },
  });

  return (
    <form
      onSubmit={handleSubmit((inputs) => {
        handleUpdateComment({ comment: inputs.comment, comment_id });
        setEditting(false);
      })}
      className="mb-2 flex p-1 w-full flex-col gap-2"
    >
      <Input {...register("comment", { required: true })} name="comment" />
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant={"outline"}
          onClick={() => setEditting(false)}
        >
          Cancel
        </Button>
        <Button type="submit" className=" hover:bg-blue-500">
          Save
        </Button>
      </div>
    </form>
  );
};

export default EditCommentForm;
