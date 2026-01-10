import { createFileRoute } from '@tanstack/react-router';
import { supabase } from '@/lib/supabase-client';
import type { BlogEntry } from '@/types/BlogEntry';
import BlogList from '@/components/BlogList';
import Pagination from '@/components/Pagination';

const BLOGS_PER_PAGE = 5;

const fetchBlogs = async () => {
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

export const Route = createFileRoute('/')({
  component: App,
  loader: async () => {
    return fetchBlogs();
  },
});

function App() {
  const {
    data: blogs,
    count,
    totalPages,
  }: {
    data: BlogEntry[];
    count: number;
    totalPages: number;
  } = Route.useLoaderData();

  return (
    <>
      <BlogList blogs={blogs} />

      {count > 5 && <Pagination totalPages={totalPages} currentPage={1} />}
    </>
  );
}
