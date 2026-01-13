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
  }

  console.log(data);
};
