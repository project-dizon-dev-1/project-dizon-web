import {
  signupSchema,
  signupType,
  loginType,
  loginSchema,
} from "@/validations/userSchema";
import { supabase } from "./supabaseClient";

const signup = async (userData: signupType) => {
  const validationResult = signupSchema.safeParse(userData);

  if (!validationResult.success) {
    throw {
      message: "Validation Failed!",
      error: validationResult.error.format(),
    };
  }

  const {
    userEmail,
    userFirstName,
    userLastName,
    userContact,
    userPassword,
    houseCode,
  } = validationResult.data;

  // First verify house code is valid
  const { data: houseData, error: houseError } = await supabase
    .from("house-code")
    .select("house_id")
    .eq("code", houseCode)
    .single();

  if (houseError || !houseData) {
    throw new Error("Invalid house code. Please check and try again.");
  }

  // Create the user in auth
  const { data, error } = await supabase.auth.signUp({
    email: userEmail,
    password: userPassword,
  });

  if (error) {
    throw new Error(`Error signing up: ${error.message}`);
  }

  if (!data?.user?.id) {
    throw new Error("User ID not found");
  }

  // Insert user with resident role
  const { error: insertError } = await supabase.from("users-list").insert([
    {
      id: data.user.id,
      user_first_name: userFirstName,
      user_last_name: userLastName,
      user_email: userEmail,
      contact_number: userContact,
      role: "resident",
    },
  ]);

  if (insertError) {
    throw new Error(`Error creating user profile: ${insertError.message}`);
  }

  // Link user to house as the main point of contact
  if (!houseData.house_id) {
    throw new Error("House ID not found");
  }

  const { error: linkError } = await supabase
    .from("house-list")
    .update({ house_main_poc: data.user.id, house_family_name: userLastName })
    .eq("id", houseData.house_id);

  if (linkError) {
    throw new Error(`Error linking user to house: ${linkError.message}`);
  }

  // delete the house code after use
  const { error: deleteError } = await supabase
    .from("house-code")
    .delete()
    .eq("code", houseCode);
  if (deleteError) {
    throw new Error(`Error deleting house code: ${deleteError.message}`);
  }
};

const login = async (userData: loginType) => {
  const validationResult = loginSchema.safeParse(userData);

  if (!validationResult.success) {
    throw new Error("Validation Failed");
  }

  const { userEmail, userPassword } = validationResult.data;

  const { data, error } = await supabase.auth.signInWithPassword({
    email: userEmail,
    password: userPassword,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user?.id) {
    throw new Error("User authentication successful but user ID is missing");
  }

  // First, check if the user exists in users-list
  const { data: userCheck, error: checkError } = await supabase
    .from("users-list")
    .select("id")
    .eq("id", data.user.id);

  if (checkError) {
    throw new Error(`Error checking user existence: ${checkError.message}`);
  }

  if (!userCheck || userCheck.length === 0) {
    throw new Error(
      "User account exists but profile is missing. Please contact support."
    );
  }

  // Now fetch the user details with error handling
  const { data: userDetails, error: fetchError } = await supabase
    .from("users-list")
    .select(
      `
      *,
      house:house-list(id,phase_id)
    `
    )
    .eq("id", data.user.id)
    .maybeSingle();

  if (fetchError) {
    throw new Error(`Error fetching user details: ${fetchError.message}`);
  }

  if (!userDetails) {
    throw new Error("User profile not found. Please contact support.");
  }

  return userDetails;
};

const logout = async () => {
  await supabase.auth.signOut();
};

const resendEmailConfirmation = async (email: string) => {
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: "https://gems.a2kgroup.org/dashboard",
    },
  });
  if (error) {
    throw new Error(`Error resending email confirmation: ${error.message}`);
  }

  return { success: true };
};

export { signup, login, logout, resendEmailConfirmation };
