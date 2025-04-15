import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import { EditReplyFormPropsType } from "@/types/commentTypes";

const EditReplyForm = ({
  comment_id,
  setEditting,
  InputDefaultValue,
  handleUpdateReply,
}: EditReplyFormPropsType) => {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      comment: InputDefaultValue || "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit((inputs) =>
        handleUpdateReply({ comment: inputs.comment, comment_id })
      )}
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
EditReplyForm.propTypes = {
  comment_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  setEditting: PropTypes.func.isRequired,
  InputDefaultValue: PropTypes.string,
  handleUpdateReply: PropTypes.func.isRequired,
};

export default EditReplyForm;
