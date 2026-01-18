import { supabase } from '@/lib/supabase-client';
import type { CommentEntry } from '@/types/CommentEntry';
import toast from 'react-hot-toast';

export const fetchComments = async (
  blogId: number,
  count?: number
): Promise<CommentEntry[] | null> => {
  const { error, data } = await supabase
    .from('comments')
    .select('*')
    .eq('blog_id', blogId)
    .order('created_at')
    .range(0, count || 5);

  if (error) {
    toast.error(`Error loading blogs: ${error.message}`);
    return null;
  }

  const commentsData = data.length > 0 ? data : null;

  return commentsData;
};
