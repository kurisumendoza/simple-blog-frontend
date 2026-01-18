import { supabase } from '@/lib/supabase-client';

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
