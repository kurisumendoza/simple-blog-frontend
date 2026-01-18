import { createFileRoute } from '@tanstack/react-router';
import type { BlogEntry } from '@/types/BlogEntry';
import { fetchBlogs } from '@/services/blogs';
import BlogList from '@/components/BlogList';
import Pagination from '@/components/Pagination';
import toast from 'react-hot-toast';

export const Route = createFileRoute('/')({
  component: App,
  loader: async () => {
    const blogs = await fetchBlogs(1);

    if (!blogs.success) toast.error(`Error loading blogs: ${blogs.message}`);

    return blogs;
  },
});

type BlogsData = {
  data: BlogEntry[];
  count: number;
  totalPages: number;
};

function App() {
  const { data: blogs, count, totalPages }: BlogsData = Route.useLoaderData();

  return (
    <>
      <BlogList blogs={blogs} />

      {count > 5 && <Pagination totalPages={totalPages} currentPage={1} />}
    </>
  );
}
