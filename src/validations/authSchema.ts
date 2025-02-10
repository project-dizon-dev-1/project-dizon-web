import { z } from "zod";

const baseSchema = z.object({
  userFirstName: z.string().min(1, "First name is required"),
  userLastName: z.string().min(1, "Last name is required"),
  userEmail: z.string().email("Email must be a valid email address"),
  userPassword: z
    .string()
    .min(6, "Password must be a minimum of 6 characters."),
  confirmPassword: z
    .string()
    .min(6, "Password must be a minimum of 6 characters."),
});

const signupSchema = baseSchema.refine(
  (data) => data.userPassword === data.confirmPassword,
  {
    message: "Passwords must match",
    path: ["confirmPassword"],
  }
);

const loginSchema = baseSchema.omit({
  userFirstName: true,
  userLastName: true,
  confirmPassword: true,
}).extend({
  userPassword: z.string(), 
});

type loginType = z.infer<typeof loginSchema>;
type signupType = z.infer<typeof signupSchema>;

export { loginSchema, signupSchema };

export type { loginType, signupType };
