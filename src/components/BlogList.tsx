import type { BlogEntry } from '@/types/BlogEntry';
import BlogPreview from './BlogPreview';

const BlogList = ({ blogs }: { blogs: BlogEntry[] }) => {
  return (
    <div className="bg-gray-700 px-10 md:px-30 lg:px-60 py-15 text-gray-100">
      <h1 className="text-3xl font-bold">Blogs</h1>
      <ul className="flex flex-col mt-3 divide-y divide-gray-500">
        {blogs.map((blog) => (
          <BlogPreview key={blog.id} blog={blog} />
        ))}
      </ul>
    </div>
  );
};

export default BlogList;
