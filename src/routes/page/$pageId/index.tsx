import BlogList from '@/components/BlogList';
import Pagination from '@/components/Pagination';
import { fetchBlogs } from '@/services/blogs';
import type { BlogEntry } from '@/types/BlogEntry';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/page/$pageId/')({
  component: PageNumberRoute,
  loader: async ({ params }) => {
    return fetchBlogs(Number(params.pageId));
  },
});

function PageNumberRoute() {
  const currentPage = Route.useParams();
  const {
    data: blogs,
    totalPages,
  }: {
    data: BlogEntry[];
    count: number;
    totalPages: number;
  } = Route.useLoaderData();

  return (
    <>
      <BlogList blogs={blogs} />
      <Pagination
        currentPage={Number(currentPage.pageId)}
        totalPages={totalPages}
      />
    </>
  );
}
