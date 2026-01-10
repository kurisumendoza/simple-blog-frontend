import { createFileRoute, Link } from '@tanstack/react-router';
import { supabase } from '@/lib/supabase-client';
import type { BlogEntry } from '@/types/BlogEntry';
import BlogList from '@/components/BlogList';

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

  const totalPages = count ? Math.ceil(count / 5) : 0;

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

      {count > 5 && (
        <div className="flex justify-center items-center gap-5 pt-8">
          <button className="opacity-50 border rounded py-1 px-2" disabled>
            Back
          </button>
          <div className="flex gap-2">
            <span className="font-bold">1</span>
            <span>of</span>
            <span className="font-bold">{totalPages}</span>
          </div>
          <Link
            to="/page/$pageId"
            params={{ pageId: '2' }}
            className="border rounded py-1 px-2 cursor-pointer"
          >
            Next
          </Link>
        </div>
      )}
    </>
  );
}
