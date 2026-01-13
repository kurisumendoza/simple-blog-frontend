import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
} from '@tanstack/react-router';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchSession, loginUser } from '@/lib/auth';
import toast from 'react-hot-toast';
import BackButton from '@/components/BackButton';
import { setUser } from '@/store/authSlice';

export const Route = createFileRoute('/(auth)/login/')({
  component: LoginPage,
  loader: async () => {
    const isLoggedIn = await fetchSession();

    if (isLoggedIn) {
      throw redirect({ to: '/' });
    }

    return null;
  },
});

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await loginUser({ email, password });

    if (!result.success) {
      console.error('Failed to login: ', result.error);
      return;
    }

    const userData = await fetchSession();
    dispatch(setUser(userData ?? null));

    setEmail('');
    setPassword('');

    toast.success('Successfully logged in!');
    navigate({ to: '/' });
  };

  return (
    <>
      <BackButton />
      <h1 className="text-3xl font-bold my-3">Login</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="border w-full rounded-md px-3 py-1"
          autoComplete="off"
          required
        />
        <input
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="border w-full rounded-md px-3 py-1"
          autoComplete="off"
          required
        />
        <button className="bg-blue-400 mx-auto px-3 py-2 font-semibold rounded-md text-gray-800 cursor-pointer hover:bg-blue-800 hover:text-gray-100 transition">
          Login
        </button>
        <div>
          <span>Don't have an account yet?</span>
          <span className="font-semibold text-blue-400 ml-2 cursor-pointer hover:text-blue-100">
            <Link to="/register">Register</Link>
          </span>
        </div>
      </form>
    </>
  );
}
