import { supabase } from '@/lib/supabase-client';

type BlogDetails = {
  title: string;
  slug: string;
  body: string;
  user: string | null;
  user_id: string | null;
  image_path: string | null;
};

type UpdatedBlogDetails = {
  title: string;
  body: string;
  image_path?: string | null;
};

const BLOGS_PER_PAGE = 5;

export const fetchBlogs = async (currentPage: number) => {
  const { data, count, error } = await supabase
    .from('blogs')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(
      (currentPage - 1) * BLOGS_PER_PAGE,
      currentPage * BLOGS_PER_PAGE - 1
    );

  if (error) return { success: false, message: error.message };

  const totalPages = count ? Math.ceil(count / BLOGS_PER_PAGE) : 0;

  return { success: true, data, count, totalPages };
};

export const fetchBlogBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) return { success: false, message: error.message };

  return { success: true, data };
};

export const createBlog = async (blogDetails: BlogDetails) => {
  const { error } = await supabase.from('blogs').insert(blogDetails).single();

  if (error) return { success: false, message: error.message };

  return { success: true };
};

export const deleteBlog = async (blogId: number) => {
  const { error } = await supabase.from('blogs').delete().eq('id', blogId);

  if (error) return { success: false, message: error.message };

  return { success: true };
};

export const updateBlog = async (
  updatedBlog: UpdatedBlogDetails,
  blogId: number
) => {
  const { error } = await supabase
    .from('blogs')
    .update(updatedBlog)
    .eq('id', blogId);

  if (error) return { success: false, message: error.message };

  return { success: true };
};

export const updateBlogWithoutImage = async (blogId: number) => {
  const { error } = await supabase
    .from('blogs')
    .update({ image_path: null })
    .eq('id', blogId);

  if (error) return { success: false, message: error.message };

  return { success: true };
};
