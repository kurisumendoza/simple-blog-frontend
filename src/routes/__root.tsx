import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { TanStackDevtools } from '@tanstack/react-devtools';
import Header from '@/components/Header';
import { Toaster } from 'react-hot-toast';

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="min-h-screen bg-gray-400 px-10 md:px-30 lg:px-60 py-15 text-gray-100">
      <Toaster position="top-right" reverseOrder={false} />
      <Header />
      <main className="bg-gray-700 rounded-md py-6 px-8 shadow-lg">
        <Outlet />
      </main>
      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </div>
  );
}
