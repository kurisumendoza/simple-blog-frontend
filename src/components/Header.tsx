import { logoutUser } from '@/lib/auth';
import type { RootState } from '@/store/store';
import { Link } from '@tanstack/react-router';
import { useSelector } from 'react-redux';

const Header = ({ user = 'Guest' }: { user?: string }) => {
  const currentUser = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="flex justify-between fixed top-0 left-0 w-full bg-gray-500 py-2 px-10 md:px-30 lg:px-60 text-white shadow-lg">
      <div>
        <p>Hi, {currentUser || user}</p>
      </div>
      <ul className="flex justify-between gap-5">
        {currentUser && (
          <>
            <li>
              <button onClick={logoutUser} className="cursor-pointer">
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
