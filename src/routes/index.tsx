import { createFileRoute } from '@tanstack/react-router';
import type { BlogEntry } from '@/types/BlogEntry';
import { fetchBlogs } from '@/lib/blogs';
import { fetchSession } from '@/lib/auth';
import { useDispatch } from 'react-redux';
import { setUser } from '@/store/authSlice';
import BlogList from '@/components/BlogList';
import Pagination from '@/components/Pagination';
import { useEffect } from 'react';

export const Route = createFileRoute('/')({
  component: App,
  loader: async () => {
    const blogsData = await fetchBlogs(1);
    const userData = await fetchSession();

    return { blogsData, userData };
  },
});

type BlogsData = {
  data: BlogEntry[];
  count: number;
  totalPages: number;
};

type UserData = {
  user: { user: string | null };
};

function App() {
  const dispatch = useDispatch();

  const { blogsData, userData }: { blogsData: BlogsData; userData: UserData } =
    Route.useLoaderData();

  const { data: blogs, count, totalPages } = blogsData;

  const { user } = userData;

  useEffect(() => {
    dispatch(setUser(user));
  }, [user]);

  return (
    <>
      <BlogList blogs={blogs} />

      {count > 5 && <Pagination totalPages={totalPages} currentPage={1} />}
    </>
  );
}
