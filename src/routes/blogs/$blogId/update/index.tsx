import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/blogs/$blogId/update/')({
  component: UpdateBlogPage,
});

function UpdateBlogPage() {
  return <div>Hello "/blogs/$blogId/update/"!</div>;
}
