import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { supabase } from '@/lib/supabase-client';
import { fetchBlogBySlug } from '@/lib/blogs';
import type { RootState } from '@/store/store';
import type { BlogEntry } from '@/types/BlogEntry';
import BackButton from '@/components/BackButton';
import toast from 'react-hot-toast';

export const Route = createFileRoute('/blogs/$blogId/update/')({
  component: UpdateBlogPage,
  loader: async ({ params }) => {
    return fetchBlogBySlug(params.blogId);
  },
});

function UpdateBlogPage() {
  const blog: BlogEntry = Route.useLoaderData();

  const [title, setTitle] = useState(blog.title);
  const [body, setBody] = useState(blog.body);

  const currentUserAuthId = useSelector(
    (state: RootState) => state.auth.authId
  );

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedBlog = {
      title: title.trim(),
      body: body.trim(),
    };

    const { error } = await supabase
      .from('blogs')
      .update(updatedBlog)
      .eq('user_id', currentUserAuthId);

    if (error) {
      toast.error(`Failed to update blog: ${error.message}`);
      return;
    }

    toast.success('Blog successfully updated!');
  };

  return (
    <>
      <BackButton />
      <h1 className="text-3xl font-bold my-3">Create a New Blog</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          type="text"
          value={title}
          placeholder="Edit Title"
          onChange={(e) => setTitle(e.target.value)}
          className="border w-full rounded-md px-3 py-1"
          required
        />
        <textarea
          name="body"
          value={body}
          placeholder="Edit your content"
          onChange={(e) => setBody(e.target.value)}
          className="border w-full rounded-md px-3 py-1 min-h-100"
          required
        />
        <button className="bg-blue-400 mx-auto px-3 py-2 font-semibold rounded-md text-gray-800 cursor-pointer hover:bg-blue-800 hover:text-gray-100 transition">
          Update Blog
        </button>
      </form>
    </>
  );
}
