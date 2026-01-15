import { supabase } from '@/lib/supabase-client';
import toast from 'react-hot-toast';

export const fetchComments = async (count?: number) => {
  const { error, data } = await supabase
    .from('comments')
    .select('*')
    .order('created_at')
    .range(0, count || 5);

  if (error) {
    toast.error(`Error loading blogs: ${error.message}`);
    return;
  }

  return { data };
};
