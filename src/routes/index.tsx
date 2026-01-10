import { createFileRoute } from '@tanstack/react-router';
import type { BlogEntry } from '@/types/BlogEntry';
import BlogList from '@/components/BlogList';
import Pagination from '@/components/Pagination';
import { fetchBlogs } from '@/lib/blogs';

export const Route = createFileRoute('/')({
  component: App,
  loader: async () => {
    return fetchBlogs(1);
  },
});

function App() {
  const {
    data: blogs,
    count,
    totalPages,
  }: {
    data: BlogEntry[];
    count: number;
    totalPages: number;
  } = Route.useLoaderData();

  return (
    <>
      <BlogList blogs={blogs} />

      {count > 5 && <Pagination totalPages={totalPages} currentPage={1} />}
    </>
  );
}
