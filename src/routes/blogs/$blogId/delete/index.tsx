import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/blogs/$blogId/delete/')({
  component: DeletePage,
});

function DeletePage() {
  return <div>Hello "/blogs/$blogId/delete/"!</div>;
}
