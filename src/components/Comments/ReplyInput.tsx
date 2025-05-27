import { getInitial } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import useUserContext from "@/hooks/useUserContext";
import { ReplyFormInputs, ReplyInputPropType } from "@/types/commentTypes";
import useReply from "@/hooks/useReply";
import { Textarea } from "../ui/textarea";

const ReplyInput = ({
  comment_id,
  setIsReplying,
  announcement_id,
}: // replyTo,
ReplyInputPropType) => {
  const { handleAddReply } = useReply(comment_id, announcement_id);
  const { user } = useUserContext();
  const { register, reset, handleSubmit } = useForm<ReplyFormInputs>();

  // useEffect(() => {
  //   if (replyTo) {
  //     setValue("reply", `@${replyTo} `);
  //   }
  // }, [replyTo, setValue]);

  return (
    <div className="mr-2 flex flex-col gap-2 mt-5">
      <form
        onSubmit={handleSubmit((inputs) => {
          handleAddReply(comment_id, {
            comment: inputs.reply,
            userId: user?.id,
            announcementId: announcement_id,
          });
          reset(); // Clear input after submitting
          setIsReplying(false);
        })}
        className="flex"
      >
        <div className="flex flex-grow flex-col gap-2">
          <div className="flex gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={""} alt="@shadcn" />
              <AvatarFallback className="bg-accent bg-blue-100">
                {getInitial(user?.user_first_name)}
              </AvatarFallback>
            </Avatar>
            <Textarea
              {...register("reply", { required: true })}
              className="rounded-2xl h-9 max-h-9  bg-default focus:border-none resize-none focus:outline-none"
              name="reply"
              placeholder="Type your reply here"
            />
          </div>

          <div className="flex justify-end">
            <div className="flex gap-2">
              <Button
                type="button"
                className="rounded-xl"
                onClick={() => setIsReplying(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button className="rounded-xl" type="submit">
                Reply
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ReplyInput;
