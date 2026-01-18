import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchBlogBySlug } from '@/services/blogs';
import { supabase } from '@/lib/supabase-client';
import type { RootState } from '@/store/store';
import type { BlogEntry } from '@/types/BlogEntry';
import BackButton from '@/components/BackButton';
import CommentSection from '@/components/CommentSection';

export const Route = createFileRoute('/blogs/$blogId/')({
  component: BlogPage,
  loader: async ({ params }) => {
    return fetchBlogBySlug(params.blogId);
  },
});

function BlogPage() {
  const [image, setImage] = useState<string | null>(null);

  const blog: BlogEntry = Route.useLoaderData();

  const currentUserAuthId = useSelector(
    (state: RootState) => state.auth.authId
  );

  useEffect(() => {
    if (!blog?.image_path) return;

    const { data } = supabase.storage
      .from('blog-images')
      .getPublicUrl(blog.image_path);

    setImage(data.publicUrl);
  }, [blog?.image_path]);

  return (
    <>
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

      {image && (
        <div className="mt-5">
          <img
            src={image}
            alt=""
            className="max-h-100 w-full object-cover rounded-md shadow"
          />
        </div>
      )}

      <p className="my-5">{blog.body}</p>
      {currentUserAuthId === blog.user_id && (
        <>
          <div className="flex gap-3 mt-5">
            <Link to="/blogs/$blogId/update" params={{ blogId: blog.slug }}>
              <button className="bg-blue-400 mx-auto px-3 py-2 w-25 font-semibold rounded-md text-gray-800 cursor-pointer hover:bg-blue-800 hover:text-gray-100 transition">
                Update
              </button>
            </Link>
            <Link to="/blogs/$blogId/delete" params={{ blogId: blog.slug }}>
              <button className="bg-red-400 mx-auto px-3 py-2 w-25 font-semibold rounded-md text-gray-800 cursor-pointer hover:bg-red-800 hover:text-gray-100 transition">
                Delete
              </button>
            </Link>
          </div>
        </>
      )}
      <CommentSection blogId={blog.id} />
    </>
  );
}
