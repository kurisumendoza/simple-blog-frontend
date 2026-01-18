import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
} from '@tanstack/react-router';
import { deleteBlog, fetchBlogBySlug } from '@/services/blogs';
import type { BlogEntry } from '@/types/BlogEntry';
import BackButton from '@/components/BackButton';
import toast from 'react-hot-toast';
import { deleteImage } from '@/services/storage';

export const Route = createFileRoute('/blogs/$blogId/delete/')({
  component: DeletePage,
  loader: async ({ params }) => {
    const blog = await fetchBlogBySlug(params.blogId);

    if (!blog.success) {
      toast.error(`Oops, that blog no longer exists!: ${blog.message}`);
      throw redirect({ to: '/' });
    }

    return blog.data;
  },
});

function DeletePage() {
  const blog: BlogEntry = Route.useLoaderData();
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (blog.image_path) deleteImage('blog-images', blog.image_path);

    const deleteRes = await deleteBlog(blog.id);

    if (!deleteRes.success) {
      toast.error(`Failed to delete blog: ${deleteRes.message}`);
      return;
    }

    navigate({ to: '/' });
    toast.success('Blog successfully deleted!');
  };

  return (
    <>
      <BackButton />
      <h1 className="text-3xl font-bold my-3">Delete Blog</h1>
      <p>Are you sure you want to delete this blog?</p>
      <p>You will not be able to recover it.</p>
      <p className="font-bold border rounded-md py-1 px-2 mt-3 mb-8">
        {blog.title}
      </p>
      <div>
        <div className="flex gap-3 mt-5">
          <button
            onClick={handleDelete}
            className="bg-red-400 px-3 py-2 w-25 font-semibold rounded-md text-gray-800 cursor-pointer hover:bg-red-800 hover:text-gray-100 transition"
          >
            Delete
          </button>
          <Link to="/blogs/$blogId" params={{ blogId: blog.slug }}>
            <button className="bg-blue-400  px-3 py-2 w-25 font-semibold rounded-md text-gray-800 cursor-pointer hover:bg-blue-800 hover:text-gray-100 transition">
              Cancel
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
