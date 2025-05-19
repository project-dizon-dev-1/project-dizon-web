import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Icon } from "@iconify/react/dist/iconify.js";
import useUserContext from "@/hooks/useUserContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { submitFeedback } from "@/services/feedbackServices";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  feedbackSchema,
  FeedbackSchemaType,
} from "@/validations/feedbackSchema";

const FeedbackForm = () => {
  const { user } = useUserContext();
  const [currentFiles, setCurrentFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [characterCount, setCharacterCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FeedbackSchemaType>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      feedback: "",
      files: [],
    },
  });

  const feedbackMutation = useMutation({
    mutationFn: submitFeedback,
    onMutate: () => {
      toast({
        title: "Submitting feedback...",
        description: "We're processing your suggestions.",
      });
    },
    onSuccess: () => {
      toast({
        title: "Thank you for your feedback!",
        description: "Your suggestions will help us improve the system.",
      });
      form.reset();
      setCharacterCount(0);
    },
    onError: (error) => {
      toast({
        title: "Submission failed",
        description: `${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleRemoveFile = (index: number) => {
    const updatedFiles = [...currentFiles];
    const updatedPreviews = [...filePreviews];

    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);

    setCurrentFiles(updatedFiles);
    setFilePreviews(updatedPreviews);
  };

  const onSubmit = (data: FeedbackSchemaType) => {
    const formData = new FormData();
    formData.append("feedback", data.feedback);
    data?.files?.map((file) => {
      formData.append("files", file);
    });

    feedbackMutation.mutate({ data: formData, userId: user?.id });
  };

  return (
    <div className="container mx-auto max-w-3xl overflow-y-scroll no-scrollbar">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Share Your Feedback</h1>
        <p className="text-muted-foreground">
          Help us improve the system by sharing your suggestions
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Feedback Form</CardTitle>
          <CardDescription>
            Your feedback is valuable in helping us enhance your experience.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="feedback"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Feedback</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Share your suggestions for improvement..."
                          className="min-h-[220px] resize-none"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            setCharacterCount(e.target.value.length);
                          }}
                        />
                      </FormControl>
                      <div className="flex justify-between">
                        <FormDescription>
                          Please be specific about what you&apos;d like to see
                          improved.
                        </FormDescription>
                        <span
                          className={`text-xs ${
                            characterCount > 900
                              ? "text-red-600"
                              : characterCount > 0
                              ? "text-green-600"
                              : "text-muted-foreground"
                          }`}
                        >
                          {characterCount}/1000
                        </span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="files"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upload Files (optional)</FormLabel>
                      <FormControl>
                        <FormItem>
                          <FormControl>
                            <Input
                              id="file-input"
                              type="file"
                              multiple
                              className="hidden"
                              ref={inputRef}
                              accept=".jpg, .jpeg, .png,"
                              onChange={(e) => {
                                const files = Array.from(e.target.files || []);

                                if (files && files.length > 0) {
                                  field.onChange([...currentFiles, ...files]);
                                  setCurrentFiles((prev) => [
                                    ...prev,
                                    ...files,
                                  ]);

                                  setFilePreviews((prevState) => [
                                    ...prevState,
                                    ...files.map((item) =>
                                      URL.createObjectURL(item)
                                    ),
                                  ]);
                                  //reset input value to allow re-uploading the same file
                                  if (inputRef.current) {
                                    inputRef.current.value = "";
                                  }
                                }
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex max-h-[110px] w-full max-w-[420px] gap-3 overflow-x-scroll">
                  {filePreviews.map((url, index) => (
                    <div
                      key={index}
                      className="relative flex justify-center h-[100px] w-[100px] flex-shrink-0 rounded-md"
                    >
                      <img
                        className="object-cover object-center"
                        src={url}
                        alt="an image"
                      />
                      <Icon
                        onClick={() => handleRemoveFile(index)}
                        className="absolute right-1 top-1 text-xl hover:cursor-pointer"
                        icon={"mingcute:close-circle-fill"}
                      />
                    </div>
                  ))}
                  <Label htmlFor="file-input">
                    <div className="flex h-[100px] w-[100px] flex-shrink-0 items-center justify-center rounded-md border border-primary-outline bg-[#DEEDFF] hover:cursor-pointer">
                      <Icon className="h-9 w-9" icon={"mingcute:add-line"} />
                    </div>
                  </Label>
                </div>
              </div>

              <div className="rounded-lg bg-blue-50 p-4 border border-blue-100">
                <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-1">
                  <Icon icon="mingcute:bulb-fill" className="text-blue-600" />
                  What kind of feedback is helpful?
                </h4>
                <ul className="text-xs text-blue-700 space-y-1 list-disc pl-4">
                  <li>
                    Feature requests that would make your experience better
                  </li>
                  <li>Suggestions to improve existing functionalities</li>
                  <li>Reports of confusing or difficult to use interfaces</li>
                  <li>
                    Ideas for new features or reports you`&apos;`d like to see
                  </li>
                </ul>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => {
              form.reset();
              setCharacterCount(0);
            }}
            disabled={feedbackMutation.isPending}
          >
            Reset Form
          </Button>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={feedbackMutation.isPending}
          >
            {feedbackMutation.isPending ? (
              <>
                <Icon
                  icon="mingcute:loading-line"
                  className="mr-2 h-4 w-4 animate-spin"
                />
                Submitting...
              </>
            ) : (
              <>
                <Icon
                  icon="mingcute:send-plane-fill"
                  className="mr-2 h-4 w-4"
                />
                Submit Feedback
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default FeedbackForm;
