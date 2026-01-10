import type { BlogEntry } from '@/types/BlogEntry';

const BlogPost = ({ blog }: { blog: BlogEntry }) => {
  return (
    <li className="py-4">
      <div>
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
        <p className="mt-2">
          {blog.body.length > 100 ? `${blog.body.slice(0, 120)}...` : blog.body}
        </p>
      </div>
    </li>
  );
};

export default BlogPost;
