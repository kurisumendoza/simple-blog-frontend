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
    console.error('Error signing up: ', error.message);
    return;
  }
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
  await supabase.auth.signOut();
};

export const fetchSession = async () => {
  const session = await supabase.auth.getSession();
  const userData = session.data.session?.user.user_metadata;

  return userData ?? null;
};
