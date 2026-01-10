import { createFileRoute } from '@tanstack/react-router';
import { supabase } from '@/supabase-client';
import Navbar from '@/components/Navbar';

const fetchBlogs = async () => {
  const { error, data } = await supabase
    .from('blogs')
    .select('*')
    .order('created_at', { ascending: true });

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
  const blogs = Route.useLoaderData();
  console.log(blogs);

  return (
    <>
      <Navbar />
    </>
  );
}
