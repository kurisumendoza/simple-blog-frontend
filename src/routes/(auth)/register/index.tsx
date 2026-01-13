import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
} from '@tanstack/react-router';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchSession, registerUser } from '@/lib/auth';
import { setUser } from '@/store/authSlice';
import BackButton from '@/components/BackButton';
import toast from 'react-hot-toast';

export const Route = createFileRoute('/(auth)/register/')({
  component: RegisterPage,
  loader: async () => {
    const isLoggedIn = await fetchSession();

    if (isLoggedIn) {
      throw redirect({ to: '/' });
    }

    return null;
  },
});

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await registerUser({ email, password, user: username });

    if (!result.success) {
      toast.error(`Failed to register: ${result.error}`);
      return;
    }

    const userData = await fetchSession();
    dispatch(setUser(userData ?? null));

    setUsername('');
    setEmail('');
    setPassword('');

    toast.success('Registered successfully!');
    navigate({ to: '/' });
  };

  return (
    <>
      <BackButton />
      <h1 className="text-3xl font-bold my-3">Register</h1>
      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="text"
          value={username}
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          className="border w-full rounded-md px-3 py-1"
          autoComplete="off"
          required
        />
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
          Register
        </button>
        <div>
          <span>Already have an account?</span>
          <span className="font-semibold text-blue-400 ml-2 cursor-pointer hover:text-blue-100">
            <Link to="/login">Login</Link>
          </span>
        </div>
      </form>
    </>
  );
}
