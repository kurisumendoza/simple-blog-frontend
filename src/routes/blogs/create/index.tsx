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

const MAX_FILE_SIZE = 5 * 1024 * 1024;

function CreateBlogPage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState<File | null>(null);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error('Image must be smaller than 5MB');
      return;
    }

    setImage(file);
  };

  const handleImageUpload = async (file: File | null) => {
    if (!file) return;

    const ext = file.name.split('.').pop();
    const newFileName = `${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage
      .from('blog-images')
      .upload(`public/${newFileName}`, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      toast.error(`Failed to upload image. ${error.message}`);
      return;
    }

    return newFileName;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let imagePath: string | null = null;

    if (image) {
      const fileName = await handleImageUpload(image);
      if (!fileName) return;

      imagePath = `public/${fileName}`;
    }

    const newBlog = {
      title: title.trim(),
      slug: generateUniqueSlug(title),
      body: body.trim(),
      user: currentUser,
      user_id: currentUserAuthId,
      image_path: imagePath,
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
          maxLength={100}
          onChange={(e) => setTitle(e.target.value)}
          className="border w-full rounded-md px-3 py-1"
          required
        />
        <textarea
          name="body"
          value={body}
          placeholder="Write your content"
          maxLength={10000}
          onChange={(e) => setBody(e.target.value)}
          className="border w-full rounded-md px-3 py-1 min-h-100"
          required
        />
        <div className="flex items-center">
          <p>Upload an image</p>
          <label
            htmlFor="image"
            className="bg-blue-300 rounded-md text-gray-950 px-3 py-1 ml-5 cursor-pointer"
          >
            {image ? 'Change Image' : 'Choose File'}
          </label>
          <input
            id="image"
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
        {image && (
          <div className="flex flex-col w-33 gap-2">
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              className="mt-1 h-20 rounded-md object-cover"
            />
            <button
              type="button"
              onClick={() => setImage(null)}
              className="bg-red-400 rounded-md text-white px-3 py-1 cursor-pointer text-nowrap"
            >
              Remove Image
            </button>
          </div>
        )}
        <button className="bg-blue-400 mt-5 mx-auto px-3 py-2 font-semibold rounded-md text-gray-800 cursor-pointer hover:bg-blue-800 hover:text-gray-100 transition">
          Create Blog
        </button>
      </form>
    </>
  );
}
