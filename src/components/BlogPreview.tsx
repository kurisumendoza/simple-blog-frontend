import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { Link } from '@tanstack/react-router';
import type { BlogEntry } from '@/types/BlogEntry';

const BlogPreview = ({ blog }: { blog: BlogEntry }) => {
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    if (!blog?.image_path) return;

    const { data } = supabase.storage
      .from('blog-images')
      .getPublicUrl(blog.image_path);

    setImage(data.publicUrl);
  }, [blog?.image_path]);

  return (
    <li className="py-4">
      <h2 className="text-xl font-semibold">{blog.title}</h2>
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
      <div className="flex justify-between">
        <p className="my-2">
          {blog.body.length > 100 ? `${blog.body.slice(0, 120)}...` : blog.body}
        </p>
        {image && (
          <img
            src={image}
            alt="Preview"
            className="mt-1 h-20 rounded-md object-cover w-[25%]"
          />
        )}
      </div>
      <Link
        to="/blogs/$blogId"
        params={{ blogId: blog.slug }}
        className="text-blue-400 font-semibold cursor-pointer hover:font-bold"
      >
        Read More →
      </Link>
    </li>
  );
};

export default BlogPreview;
