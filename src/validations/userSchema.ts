import { z } from "zod";

const baseSchema = z.object({
  userFirstName: z.string().min(1, "First name is required"),
  userLastName: z.string().min(1, "Last name is required"),
  userEmail: z.string().email("Invalid email address"),
  userContact: z
    .string()
    .regex(
      /^(09|\+?639)\d{9}$/,
      "Must be a valid Philippine mobile number (09XXXXXXXXX or 639XXXXXXXXX)"
    )
    .optional(),
  houseCode: z.string().min(1, "House code is required"),
  userPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must include uppercase, lowercase, number and special character"
    ),
  confirmPassword: z.string().min(1, "Please confirm your password"),
});

const signupSchema = baseSchema
  .extend({
    agreementAccepted: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions to continue.",
    }),
  })
  .refine((data) => data.userPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const loginSchema = baseSchema
  .omit({
    userFirstName: true,
    userLastName: true,
    houseCode: true,
    confirmPassword: true,
    userContact: true,
  })
  .extend({
    userPassword: z.string().min(1, "Password is required"),
  });

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must include uppercase, lowercase and a number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const recoverySchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must include uppercase, lowercase, number and special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  contactNumber: z
    .string()
    .regex(
      /^(09|\+?639)\d{9}$/,
      "Must be a valid Philippine mobile number (09XXXXXXXXX or 639XXXXXXXXX)"
    )
    .optional(),
});

const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

type ProfileFormValues = z.infer<typeof profileSchema>;
type RecoveryFormValues = z.infer<typeof recoverySchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;
type loginType = z.infer<typeof loginSchema>;
type signupType = z.infer<typeof signupSchema>;

export {
  contactFormSchema,
  loginSchema,
  signupSchema,
  passwordSchema,
  profileSchema,
  recoverySchema,
};

export type {
  ContactFormValues,
  loginType,
  signupType,
  PasswordFormValues,
  ProfileFormValues,
  RecoveryFormValues,
};
