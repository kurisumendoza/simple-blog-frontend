import { createFileRoute } from '@tanstack/react-router';
import { supabase } from '@/lib/supabase-client';
import type { BlogEntry } from '@/types/BlogEntry';
import BlogList from '@/components/BlogList';

const fetchBlogs = async () => {
  const { error, data } = await supabase
    .from('blogs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading blogs: ', error.message);
    return;
  }

  return data;
};

export const Route = createFileRoute('/')({
  component: App,
  loader: async () => {
    return fetchBlogs();
  },
});

function App() {
  const blogs: BlogEntry[] = Route.useLoaderData();

  return <BlogList blogs={blogs} />;
}
