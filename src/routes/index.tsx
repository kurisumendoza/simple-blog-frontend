import { createFileRoute } from '@tanstack/react-router';
import { supabase } from '@/lib/supabase-client';
import Navbar from '@/components/Navbar';
import type { BlogEntry } from '@/types/BlogEntry';

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

  return (
    <>
      <Navbar />
      <div className="h-screen bg-gray-700 px-10 md:px-30 lg:px-60 py-15 text-gray-100">
        <h1 className="text-3xl font-bold">Blogs</h1>
        <ul className="flex flex-col mt-3 divide-y divide-gray-500">
          {blogs.map((blog) => (
            <li key={blog.id} className="py-4">
              <div>
                <h2 className="text-xl font-semibold">{blog.title}</h2>
                <div className="flex justify-between text-sm">
                  <div>
                    <span>by: </span>
                    <span className="font-bold text-sky-200">{blog.user}</span>
                  </div>
                  <span className="italic">
                    {new Date(blog.created_at).toLocaleDateString('en-PH', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                    })}
                  </span>
                </div>
                <p className="mt-2">
                  {blog.body.length > 100
                    ? `${blog.body.slice(0, 120)}...`
                    : blog.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
