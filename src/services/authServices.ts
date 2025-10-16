import {
  signupSchema,
  signupType,
  loginType,
  loginSchema,
} from '@/validations/userSchema';
import { supabase } from './supabaseClient';

// ✅ Helper to check if user already exists by email
const checkUserEmailExists = async (email: string) => {
  const { data, error } = await supabase
    .from('users-list')
    .select('user_email')
    .eq('user_email', email)
    .maybeSingle();

  if (error) {
    console.error('❌ Error checking user email:', error);
    throw new Error(error.message || 'Failed to verify existing email');
  }

  return data ? data.user_email : null;
};

// ✅ Signup (existing, unchanged)
const signup = async (userData: signupType) => {
  const validationResult = signupSchema.safeParse(userData);

  if (!validationResult.success) {
    throw {
      message: 'Validation Failed!',
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

  const { data: houseData, error: houseError } = await supabase
    .from('house-code')
    .select('house_id')
    .eq('code', houseCode)
    .single();

  if (houseError || !houseData) {
    throw new Error('Invalid house code. Please check and try again.');
  }

  const { data, error } = await supabase.auth.signUp({
    email: userEmail,
    password: userPassword,
  });

  if (error) {
    throw new Error(`Error signing up: ${error.message}`);
  }

  if (!data?.user?.id) {
    throw new Error('User ID not found');
  }

  const { error: insertError } = await supabase.from('users-list').insert([
    {
      id: data.user.id,
      user_first_name: userFirstName,
      user_last_name: userLastName,
      user_email: userEmail,
      contact_number: userContact,
      role: 'resident',
    },
  ]);

  if (insertError) {
    throw new Error(`Error creating user profile: ${insertError.message}`);
  }

  if (!houseData.house_id) {
    throw new Error('House ID not found');
  }
  const { error: linkError } = await supabase
    .from('house-list')
    .update({ house_main_poc: data.user.id, house_family_name: userLastName })
    .eq('id', houseData.house_id);

  if (linkError) {
    throw new Error(`Error linking user to house: ${linkError.message}`);
  }

  const { error: deleteError } = await supabase
    .from('house-code')
    .delete()
    .eq('code', houseCode);
  if (deleteError) {
    throw new Error(`Error deleting house code: ${deleteError.message}`);
  }
};

// ✅ Login (existing, unchanged)
const login = async (userData: loginType) => {
  const validationResult = loginSchema.safeParse(userData);

  if (!validationResult.success) {
    throw new Error('Validation Failed');
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
    throw new Error('User authentication successful but user ID is missing');
  }

  const { data: userCheck, error: checkError } = await supabase
    .from('users-list')
    .select('id')
    .eq('id', data.user.id);

  if (checkError) {
    throw new Error(`Error checking user existence: ${checkError.message}`);
  }

  if (!userCheck || userCheck.length === 0) {
    throw new Error(
      'User account exists but profile is missing. Please contact support.'
    );
  }

  const { data: userDetails, error: fetchError } = await supabase
    .from('users-list')
    .select(
      `
      *,
      house:"house-list"(id,phase_id)
    `
    )
    .eq('id', data.user.id)
    .maybeSingle();

  if (fetchError) {
    throw new Error(`Error fetching user details: ${fetchError.message}`);
  }

  if (!userDetails) {
    throw new Error('User profile not found. Please contact support.');
  }

  return userDetails;
};

// ✅ Logout (existing, unchanged)
const logout = async () => {
  await supabase.auth.signOut();
};

// ✅ Resend Email Confirmation (existing, unchanged)
const resendEmailConfirmation = async (email: string) => {
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: {
      emailRedirectTo: 'https://gems.a2kgroup.org/dashboard',
    },
  });
  if (error) {
    throw new Error(`Error resending email confirmation: ${error.message}`);
  }

  return { success: true };
};

// ✅ New: Request OTP (TypeScript version)
export const requestOtp = async (email: string, password: string) => {
  const existingEmail = await checkUserEmailExists(email);
  if (existingEmail) {
    throw new Error(`Email ${existingEmail} is already registered.`);
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error('❌ OTP request failed:', error);
    throw new Error(error.message || 'Failed to send OTP');
  }

  console.log('✅ OTP requested successfully for:', email);
  return { email };
};

export const verifyOtp = async (
  email: string,
  otpCode: string,
  userFirstName: string,
  userLastName: string,
  contactNumber: string
) => {
  console.log('🔹 Starting OTP verification for email:', email);

  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: otpCode,
    type: 'signup',
  });

  if (error) {
    console.error('❌ OTP verification error:', error);
    throw new Error(error?.message || 'Invalid OTP');
  }

  if (!data?.session) {
    console.warn(
      '⚠️ OTP verification succeeded but no session returned:',
      data
    );
    throw new Error('Invalid OTP: no session returned');
  }

  const user = data.user;
  console.log('✅ OTP verified successfully. Supabase user object:', user);

  // 🧾 Insert user details into users-list
  const userData = {
    id: user?.id,
    user_email: email,
    user_first_name: userFirstName,
    user_last_name: userLastName,
    contact_number: contactNumber,
    role: 'superadmin' as 'superadmin',
  };

  const { error: insertError } = await supabase
    .from('users-list')
    .insert([userData]);

  if (insertError) {
    console.error('❌ Failed to insert new OTP user:', insertError);
    throw new Error(
      insertError.message || 'Failed to create user in users-list'
    );
  }

  // 🧩 Update user metadata
  const { error: metadataError } = await supabase.auth.updateUser({
    data: {
      password_setup_complete: true,
      ...userData,
    },
  });

  if (metadataError) {
    console.error('❌ Failed to set user metadata:', metadataError);
    throw new Error(
      metadataError.message || 'Failed to initialize user metadata'
    );
  }

  console.log('✅ OTP verification completed and user profile created.');

  return userData; // <-- Return user data (including role)
};

export { signup, login, logout, resendEmailConfirmation };
