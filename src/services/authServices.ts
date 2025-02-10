import {
  signupSchema,
  signupType,
  loginType,
  loginSchema,
} from "@/validations/authSchema";
import { supabase } from "./supabaseClient";

const signup = async (userData: signupType) => {
  const validationResult = signupSchema.safeParse(userData);

  if (!validationResult.success) {
    throw {
      message: "Validation Failed!",
      error: validationResult.error.format(),
    };
  }

  const { userEmail, userFirstName, userLastName, userPassword } =
    validationResult.data;

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

  const { error: insertError } = await supabase.from("users-list").insert([
    {
      id: data.user.id,
      user_first_name: userFirstName,
      user_last_name: userLastName,
      user_email: userEmail,
    },
  ]);

  if (insertError) {
    throw new Error(insertError.message);
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
    .select("*")
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
