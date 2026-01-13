import { Link, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSession, logoutUser } from '@/lib/auth';
import { setUser } from '@/store/authSlice';
import type { RootState } from '@/store/store';
import toast from 'react-hot-toast';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logoutUser();

    if (!result.success) {
      toast.error(`Failed to logout: ${result.error}`);
      return;
    }

    dispatch(setUser(null));

    navigate({ to: '/' });

    toast.success('You are now logged out.');
  };

  useEffect(() => {
    const syncSession = async () => {
      const sessionData = await fetchSession();
      dispatch(setUser(sessionData ?? null));
    };

    syncSession();
  }, []);

  const currentUser = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="flex justify-between fixed top-0 left-0 w-full bg-gray-500 py-2 px-[10%] sm:px-[15%] md:px-[20%] lg:px-[25%] text-white shadow-lg">
      <div>
        <p>
          Hi, <span className="font-bold">{currentUser || 'Guest'}</span>
        </p>
      </div>
      <ul className="flex justify-between gap-5">
        {currentUser && (
          <>
            <li>
              <Link to="/blogs/create">Create</Link>
            </li>
            <li>
              <button onClick={handleLogout} className="cursor-pointer">
                Logout
              </button>
            </li>
          </>
        )}

        {!currentUser && (
          <>
            <li>
              <Link to="/register">Register</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Header;
