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
  const { data, error } = await supabase.auth.signUp({
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

  console.log(data);
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
    console.error('Error signing in: ', error.message);
    return;
  }

  console.log('successful login');
};
