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

  const { userEmail, userFirstName, userLastName, userContact , userPassword, houseCode } =
    validationResult.data;

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
      role: "resident", // Default role for new signups
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

  const { data: userDetails, error: fetchError } = await supabase
    .from("users-list")
    .select(
      `
      *,
      house:"house-list"(id,phase_id)
    `
    )
    .eq("id", data.user.id)
    .single();

  if (fetchError) {
  throw new Error(fetchError.message);
  }

  return userDetails;
};

const logout = async () => {
  await supabase.auth.signOut();
};

export { signup, login, logout };
