import { supabase } from '@/lib/supabase-client';

const BLOGS_PER_PAGE = 5;

export const fetchBlogs = async () => {
  const { error, data, count } = await supabase
    .from('blogs')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(0, 4);

  if (error) {
    console.error('Error loading blogs: ', error.message);
    return;
  }

  const totalPages = count ? Math.ceil(count / BLOGS_PER_PAGE) : 0;

  return { data, count, totalPages };
};
