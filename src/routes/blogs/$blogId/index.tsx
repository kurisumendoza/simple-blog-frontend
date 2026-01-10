import { supabase } from '@/lib/supabase-client';
import type { BlogEntry } from '@/types/BlogEntry';
import { createFileRoute, Link } from '@tanstack/react-router';

const fetchBlog = async (slug: string) => {
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

export const Route = createFileRoute('/blogs/$blogId/')({
  component: BlogPage,
  loader: async ({ params }) => {
    return fetchBlog(params.blogId);
  },
});

function BlogPage() {
  const blog: BlogEntry = Route.useLoaderData();

  return (
    <div>
      <Link
        to="/"
        className="text-blue-400 font-semibold cursor-pointer hover:font-bold"
      >
        ← Back to Home
      </Link>
      <h2 className="text-2xl font-bold mt-3">{blog.title}</h2>
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
      <p className="my-5">{blog.body}</p>
    </div>
  );
}
