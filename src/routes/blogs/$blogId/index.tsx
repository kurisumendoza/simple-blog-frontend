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
  console.log(blog);

  return (
    <div>
      <Link
        to="/"
        className="text-blue-400 font-semibold cursor-pointer hover:font-bold"
      >
        ← Back to Home
      </Link>
      <p className="mt-5">Hello {blog.title}!</p>
    </div>
  );
}
