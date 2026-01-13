import BackButton from '@/components/BackButton';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/blogs/create/')({
  component: CreateBlogPage,
});

function CreateBlogPage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  return (
    <>
      <BackButton />
      <h1 className="text-3xl font-bold my-3">Create a New Blog</h1>
      <form className="space-y-4">
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
