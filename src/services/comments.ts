import { supabase } from '@/lib/supabase-client';
import type { CommentEntry } from '@/types/CommentEntry';

type NewComment = {
  user: string | null;
  user_id: string | null;
  blog_id: number | null;
  image_path: string | null;
  body: string | null;
};

type UpdatedComment = { image_path: string | null; body: string | null };

export const fetchComments = async (
  blogId: number
): Promise<{
  success: boolean;
  data: CommentEntry[] | null;
  message?: string;
}> => {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('blog_id', blogId)
    .order('created_at');

  if (error) return { success: false, data: null, message: error.message };

  return { success: true, data: data.length > 0 ? data : null };
};

export const createComment = async (comment: NewComment) => {
  const { data, error } = await supabase
    .from('comments')
    .insert(comment)
    .select()
    .single();

  if (error) return { success: false, message: error.message };

  return { success: true, data };
};

export const updateComment = async (
  comment: UpdatedComment,
  commentId: number
) => {
  const { error } = await supabase
    .from('comments')
    .update(comment)
    .eq('id', commentId);

  if (error) return { success: false, message: error.message };

  return { success: true };
};

export const updateCommentWithoutImage = async (commentId: number) => {
  const { error } = await supabase
    .from('comments')
    .update({ image_path: null })
    .eq('id', commentId);

  if (error) return { success: false, message: error.message };

  return { success: true };
};

export const deleteComment = async (commentId: number) => {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId);

  if (error) return { success: false, message: error.message };

  return { success: true };
};

export const deleteAllComments = async (blogId: number) => {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('blog_id', blogId);

  if (error) return { success: false, message: error.message };

  return { success: true };
};
