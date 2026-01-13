import BackButton from '@/components/BackButton';
import { fetchBlogBySlug } from '@/lib/blogs';
import type { RootState } from '@/store/store';
import type { BlogEntry } from '@/types/BlogEntry';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useSelector } from 'react-redux';

export const Route = createFileRoute('/blogs/$blogId/')({
  component: BlogPage,
  loader: async ({ params }) => {
    return fetchBlogBySlug(params.blogId);
  },
});

function BlogPage() {
  const blog: BlogEntry = Route.useLoaderData();

  const currentUser = useSelector((state: RootState) => state.auth.user);

  return (
    <div>
      <BackButton />
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
      {currentUser && (
        <div className="flex mt-5">
          <Link to="/blogs/$blogId/update" params={{ blogId: blog.slug }}>
            <button className="bg-blue-400 mx-auto px-3 py-2 font-semibold rounded-md text-gray-800 cursor-pointer hover:bg-blue-800 hover:text-gray-100 transition">
              Update
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
