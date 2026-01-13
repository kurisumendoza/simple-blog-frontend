import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import toast from 'react-hot-toast';
import BackButton from '@/components/BackButton';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';

export const Route = createFileRoute('/blogs/create/')({
  component: CreateBlogPage,
});

function CreateBlogPage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const currentUser = useSelector((state: RootState) => state.auth.user);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newBlog = {
      title: title.trim(),
      slug: title.trim().toLowerCase().split(' ').join('-'),
      body: body.trim(),
      user: currentUser,
    };

    const { error } = await supabase.from('blogs').insert(newBlog).single();

    if (error) {
      toast.error(`Failed to create a blog: ${error.message}`);
    }
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
