import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { supabase } from '@/lib/supabase-client';
import { fetchSession } from '@/lib/auth';
import type { RootState } from '@/store/store';
import toast from 'react-hot-toast';
import BackButton from '@/components/BackButton';

export const Route = createFileRoute('/blogs/create/')({
  component: CreateBlogPage,
  loader: async () => {
    const isLoggedIn = await fetchSession();

    if (!isLoggedIn) {
      throw redirect({ to: '/' });
    }

    return null;
  },
});

function CreateBlogPage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const currentUser = useSelector((state: RootState) => state.auth.user);
  const currentUserAuthId = useSelector(
    (state: RootState) => state.auth.authId
  );
  const navigate = useNavigate();

  const generateUniqueSlug = (string: string) => {
    const textString = string.trim().toLowerCase().split(' ').join('-');
    const uuid = crypto.randomUUID().slice(0, 6);

    return `${textString}-${uuid}`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newBlog = {
      title: title.trim(),
      slug: generateUniqueSlug(title),
      body: body.trim(),
      user: currentUser,
      user_id: currentUserAuthId,
    };

    const { error } = await supabase.from('blogs').insert(newBlog).single();

    if (error) {
      toast.error(`Failed to create a blog: ${error.message}`);
      return;
    }

    setTitle('');
    setBody('');

    toast.success('Blog successfully created!');
    navigate({ to: `/blogs/${newBlog.slug}` });
  };

  return (
    <>
      <BackButton />
      <h1 className="text-3xl font-bold my-3">Create a New Blog</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={title}
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
          className="border w-full rounded-md px-3 py-1"
          required
        />
        <textarea
          name="body"
          value={body}
          placeholder="Write your content"
          onChange={(e) => setBody(e.target.value)}
          className="border w-full rounded-md px-3 py-1 min-h-100"
          required
        />
        <button className="bg-blue-400 mx-auto px-3 py-2 font-semibold rounded-md text-gray-800 cursor-pointer hover:bg-blue-800 hover:text-gray-100 transition">
          Create Blog
        </button>
      </form>
    </>
  );
}
