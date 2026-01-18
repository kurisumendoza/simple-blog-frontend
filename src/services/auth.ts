import { supabase } from '@/lib/supabase-client';

export const registerUser = async ({
  email,
  password,
  user,
}: {
  email: string;
  password: string;
  user: string;
}) => {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { user },
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
};

export const loginUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
};

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
};

export const fetchSession = async () => {
  const { data } = await supabase.auth.getSession();

  if (!data.session) return null;

  const user: string | null = data.session?.user.user_metadata.user;
  const authId: string | undefined = data.session?.user.id;

  return { user, authId };
};
