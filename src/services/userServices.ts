import { axiosDelete, axiosGet, axiosPut } from "@/lib/axios";
import { Database } from "@/types/database";
import { supabase } from "./supabaseClient";

type User = Database["public"]["Tables"]["users-list"]["Row"];

const getUser = async (userId: string): Promise<User | null> => {
  return axiosGet(`/user/${userId}`);
};

interface ProfileUpdateData {
  firstName: string;
  lastName: string;
  contactNumber: string | null;
}

const updateUserProfile = async ({
  userId,
  houseId,
  data,
}: {
  userId?: string;
  houseId?: string | null;
  data: ProfileUpdateData;
}) => {
  return await axiosPut(`/user/update/${userId}`, {
    houseId,
    ...data,
  });
};

interface PasswordUpdateData {
  email?: string | null;
  currentPassword?: string;
  newPassword: string;
}

// Function to update user password using Supabase Auth
const updateUserPassword = async ({
  email,
  currentPassword,
  newPassword,
}: PasswordUpdateData) => {
  try {
    if (!email) {
      throw new Error("Email is required");
    }

    // Verify the current password by attempting to sign in
    if (currentPassword) {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: currentPassword,
      });

      if (signInError) {
        throw new Error("Current password is incorrect");
      }
    }

    // If sign-in is successful, update the password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      throw new Error(updateError.message);
    }

    return { success: true, message: "Password updated successfully" };
  } catch (error: any) {
    // Properly handle and rethrow the error
    console.error("Password update error:", error);
    throw error;
  }
};

const sendChangeEmailVerification = async (email: string) => {
  // Check if email already exists
  const { data } = await supabase
    .from("users-list")
    .select("id")
    .eq("user_email", email)
    .single();

  if (data) {
    throw new Error("Email already exists. Please use another email");
  }

  // Get the current origin for proper redirect URL
  const origin = window.location.origin;

  const { error } = await supabase.auth.updateUser(
    {
      email,
    },
    {
      // Redirect to profile with the hash fragment to indicate email change
      emailRedirectTo: `${origin}/profile#type=email_change`,
    }
  );

  if (error) {
    throw new Error(`Error updating email: ${error.message}`);
  }
};

const updateEmail = async ({
  user_id,
  email,
}: {
  user_id?: string;
  email: string;
}) => {
  if (!user_id || !email) {
    throw new Error("User ID and email is required");
  }
  const { error: updateError } = await supabase
    .from("users-list")
    .update({ user_email: email })
    .eq("id", user_id);

  if (updateError) {
    throw new Error(`Error updating email, ${updateError.message}`);
  }
};

const sendPasswordResetLink = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/password-recovery`,
  });

  if (error) {
    throw new Error(`Error sending password reset link: ${error.message}`);
  }
};
const deleteAccount = async (userId?: string | null) => {
  axiosDelete(`/user/delete/${userId}`);
};

export {
  sendPasswordResetLink,
  getUser,
  updateUserProfile,
  updateUserPassword,
  sendChangeEmailVerification,
  updateEmail,
  deleteAccount,
};
