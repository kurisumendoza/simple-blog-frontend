import { supabase } from '@/lib/supabase-client';

const BLOGS_PER_PAGE = 5;

export const fetchBlogs = async (currentPage: number) => {
  const { error, data, count } = await supabase
    .from('blogs')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(
      (currentPage - 1) * BLOGS_PER_PAGE,
      currentPage * BLOGS_PER_PAGE - 1
    );

  if (error) {
    console.error('Error loading blogs: ', error.message);
    return;
  }

  const totalPages = count ? Math.ceil(count / BLOGS_PER_PAGE) : 0;

  return { data, count, totalPages };
};

export const fetchBlogBySlug = async (slug: string) => {
  const { error, data } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error loading blog: ', error.message);
    return;
  }

  return data;
};
