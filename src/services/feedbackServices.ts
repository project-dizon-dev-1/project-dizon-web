import { axiosPost } from "@/lib/axios";

// Interface for feedback data
export type FeedbackData = {
  data: FormData;
  userId?: string;
};

/**
 * Submit user feedback to the server
 *
 * @param data The feedback data including user feedback and information
 * @returns The server response
 */
export const submitFeedback = async ({ userId, data }: FeedbackData) => {
  return await axiosPost(`/reports/feedback/add/${userId}`, data);
};
