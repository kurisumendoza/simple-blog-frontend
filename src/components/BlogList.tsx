import type { BlogEntry } from '@/types/BlogEntry';
import BlogPreview from './BlogPreview';

const BlogList = ({ blogs }: { blogs: BlogEntry[] }) => {
  return (
    <>
      <h1 className="text-3xl font-bold">Blogs</h1>
      <ul className="flex flex-col mt-3 divide-y divide-gray-500">
        {blogs.map((blog) => (
          <BlogPreview key={blog.id} blog={blog} />
        ))}
      </ul>
    </>
  );
};

export default BlogList;
