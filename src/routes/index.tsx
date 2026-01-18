import { createFileRoute } from '@tanstack/react-router';
import type { BlogEntry } from '@/types/BlogEntry';
import { fetchBlogs } from '@/services/blogs';
import BlogList from '@/components/BlogList';
import Pagination from '@/components/Pagination';

export const Route = createFileRoute('/')({
  component: App,
  loader: () => {
    return fetchBlogs(1);
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
