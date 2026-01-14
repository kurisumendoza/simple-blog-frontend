import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { fetchBlogBySlug } from '@/lib/blogs';
import type { BlogEntry } from '@/types/BlogEntry';
import BackButton from '@/components/BackButton';
import toast from 'react-hot-toast';

export const Route = createFileRoute('/blogs/$blogId/update/')({
  component: UpdateBlogPage,
  loader: async ({ params }) => {
    return fetchBlogBySlug(params.blogId);
  },
});

const MAX_FILE_SIZE = 5 * 1024 * 1024;

function UpdateBlogPage() {
  const blog: BlogEntry = Route.useLoaderData();

  const [title, setTitle] = useState(blog.title);
  const [body, setBody] = useState(blog.body);
  const [image, setImage] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);

  const navigate = useNavigate();

  const handleDeleteImage = async () => {
    if (!image) return setNewImage(null);

    const { error } = await supabase.storage
      .from('blog-images')
      .remove([blog.image_path]);

    if (error) {
      toast.error(`Failed to delete image. ${error.message}`);
      return;
    }

    const removeImagePath = {
      image_path: null,
    };

    const { error: removeError } = await supabase
      .from('blogs')
      .update(removeImagePath)
      .eq('id', blog.id);

    if (removeError) {
      toast.error(`Failed to remove image path. ${removeError.message}`);
      return;
    }

    setImage(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (image) handleDeleteImage();
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      toast.error('Image must be smaller than 2MB');
      return;
    }
    setNewImage(file);
  };

  // TODO
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

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let imagePath: string | null = null;

    if (newImage) {
      const fileName = await handleImageUpload(newImage);
      if (!fileName) return;

      imagePath = `public/${fileName}`;
    }

    const updatedBlog: { title: string; body: string; image_path?: string } = {
      title: title.trim(),
      body: body.trim(),
    };

    if (imagePath) {
      updatedBlog.image_path = imagePath;
    }

    const { error } = await supabase
      .from('blogs')
      .update(updatedBlog)
      .eq('id', blog.id);

    if (error) {
      toast.error(`Failed to update blog: ${error.message}`);
      return;
    }

    toast.success('Blog successfully updated!');
    navigate({ to: `/blogs/${blog.slug}` });
  };

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
      <h1 className="text-3xl font-bold my-3">Update Blog</h1>
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
        {(image || newImage) && (
          <div className="flex flex-col w-33 gap-2">
            <img
              src={
                image
                  ? image
                  : newImage
                    ? URL.createObjectURL(newImage)
                    : undefined
              }
              alt="Preview"
              className="mt-1 h-20 rounded-md object-cover"
            />
            <button
              type="button"
              onClick={handleDeleteImage}
              className="bg-red-400 rounded-md text-white px-3 py-1 cursor-pointer text-nowrap"
            >
              Delete Image
            </button>
            <p className="text-sm">
              Warning! Deleting or changing will permanently delete this image.
            </p>
          </div>
        )}
        <button className="bg-blue-400 mx-auto px-3 py-2 font-semibold rounded-md text-gray-800 cursor-pointer hover:bg-blue-800 hover:text-gray-100 transition">
          Update Blog
        </button>
      </form>
    </>
  );
}
