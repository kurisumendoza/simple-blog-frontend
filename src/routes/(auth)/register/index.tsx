import BackButton from '@/components/BackButton';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/(auth)/register/')({
  component: RegisterPage,
});

function RegisterPage() {
  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <>
      <BackButton />
      <h1 className="text-3xl font-bold my-3">Register</h1>
      <form action="" className="space-y-4">
        <input
          type="text"
          value={user}
          placeholder="Username"
          onChange={(e) => setUser(e.target.value)}
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
          type="text"
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
